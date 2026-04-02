// Runtime config — overwritten by docker-entrypoint.sh in production.
// In development, set your local values here (file is gitignored).
window.__config__ = {
  PUBLIC_HA_URL: 'http://10.100.0.90:8123',
  PUBLIC_HA_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJlNTA5NGRhMzJjYTM0ZmVlYjY4NzJiZGNiN2NhM2FmNiIsImlhdCI6MTc3Mzk1Mzc4NywiZXhwIjoyMDg5MzEzNzg3fQ.lFIpQS6ktR_aopgmZFhZv0kxM39APzB5aDJd2GWMNeY'
};
