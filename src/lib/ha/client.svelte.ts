import { PUBLIC_HA_URL, PUBLIC_HA_TOKEN } from '$env/static/public';

export interface HaState {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'authenticating' | 'connected' | 'error';

declare global {
  interface Window {
    __config__?: {
      PUBLIC_HA_URL?: string;
      PUBLIC_HA_TOKEN?: string;
    };
  }
}

class HaClient {
  status = $state<ConnectionStatus>('disconnected');
  states = $state<Record<string, HaState>>({});

  private ws: WebSocket | null = null;
  private msgId = 1;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private haUrl: string;
  private haToken: string;

  constructor() {
    // Get config from window.__config__ (runtime), fall back to PUBLIC_ env vars (build-time)
    if (typeof window !== 'undefined' && window.__config__) {
      this.haUrl = window.__config__.PUBLIC_HA_URL || PUBLIC_HA_URL;
      this.haToken = window.__config__.PUBLIC_HA_TOKEN || PUBLIC_HA_TOKEN;
    } else {
      this.haUrl = PUBLIC_HA_URL;
      this.haToken = PUBLIC_HA_TOKEN;
    }
  }

  connect() {
    if (this.ws) return;

    this.status = 'connecting';
    const url = `${this.haUrl.replace(/^http/, 'ws')}/api/websocket`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.status = 'authenticating';
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(JSON.parse(event.data));
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.status = 'disconnected';
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.status = 'error';
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  private handleMessage(msg: Record<string, unknown>) {
    switch (msg.type) {
      case 'auth_required':
        this.send({ type: 'auth', access_token: this.haToken });
        break;

      case 'auth_ok':
        this.status = 'connected';
        this.fetchStates();
        this.subscribeEvents();
        break;

      case 'auth_invalid':
        this.status = 'error';
        this.ws?.close();
        break;

      case 'result': {
        const result = msg as { id: number; success: boolean; result: unknown };
        if (result.success && Array.isArray(result.result)) {
          // Response to get_states
          const incoming: Record<string, HaState> = {};
          for (const s of result.result as HaState[]) {
            incoming[s.entity_id] = s;
          }
          this.states = incoming;
        }
        break;
      }

      case 'event': {
        const event = msg as { event: { data: { new_state: HaState | null } } };
        const newState = event.event?.data?.new_state;
        if (newState) {
          this.states = { ...this.states, [newState.entity_id]: newState };
        }
        break;
      }
    }
  }

  private fetchStates() {
    this.send({ id: this.msgId++, type: 'get_states' });
  }

  private subscribeEvents() {
    this.send({ id: this.msgId++, type: 'subscribe_events', event_type: 'state_changed' });
  }

  getEntity(entityId: string): HaState | undefined {
    return this.states[entityId];
  }

  getState(entityId: string): string | null {
    const entity = this.getEntity(entityId);
    if (!entity || entity.state === 'unavailable' || entity.state === 'unknown') return null;
    return entity.state;
  }

  getNumericState(entityId: string, decimals = 1): string | null {
    const val = parseFloat(this.getEntity(entityId)?.state ?? '');
    return isNaN(val) ? null : val.toFixed(decimals);
  }

  private send(msg: Record<string, unknown>) {
    this.ws?.send(JSON.stringify(msg));
  }

  private scheduleReconnect() {
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }
}

export const ha = new HaClient();
