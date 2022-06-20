import requests

class ZuulAPI:
    def __init__(self, host):
        self.host = host

    def _make_request(self, job_name):
        api = f'/api/tenant/openstack/builds?job_name={job_name}'
        data = requests.get(self.host + api)
        if requests.status_codes == 200:
            return data.json()
        else:
            return data.text

    def get_jobs_history(self, job_name):
        job_history = self._make_request(job_name=job_name)
