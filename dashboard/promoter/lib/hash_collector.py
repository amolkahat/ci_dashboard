# from dlrn_client import DlrnClient, DlrnClientConfig

components = [
    "baremetal", "cinder", "clients", "cloudops",
    "common", "compute", "glance", "manila",
    "network", "octavia", "security", "swift",
    "tempest", "tripleo", "ui", "validation"
]

import dlrnapi_client


class HashCollector:
    """
    Hash collector class will collect hashes and update
    jobs and to it.
    """

    def __init__(self, ):
        # self.config = config
        self.hash_dict = {}

    # def get_promotions(self, label='tripleo-ci-testing'):
    #     """
    #     Fetch promotion for given label
    #     :param label:
    #     :return:
    #     """
    #     config = DlrnClientConfig(
    #         dlrnauth_username='ciuser',
    #         dlrnauth_password='',
    #         api_url='http://trunk.rdoproject.org/api-centos9-master-uc/')
    #     d = DlrnClient(config)
    #     promotions = d.fetch_promotions(label)
    #
    #     return promotions

    def get_component_promotions(self):
        api_url = 'http://trunk.rdoproject.org/api-centos9-master-uc/'
        dlrnapi_client.configuration.password = 'ciuser'
        dlrnapi_client.configuration.username = ''
        api_client = dlrnapi_client.ApiClient(host=api_url)
        api_instance = dlrnapi_client.DefaultApi(api_client=api_client)
        # last_promotions = {}
        # named_hashes_map = {}
        #
        # hashes_params = dlrnapi_client.PromotionQuery()
        # jobs_params = dlrnapi_client.Params2()
        # jobs_params_aggregate = dlrnapi_client.Params3()
        # report_params = dlrnapi_client.Params3()
        # promote_params = dlrnapi_client.Promotion()

        get_repo_params = dlrnapi_client.Params()
        components_list = []
        for c in components:
            get_repo_params.component = c
            get_repo_params.max_age = 0
            repo_data = api_instance.api_last_tested_repo_get(
                params=get_repo_params)
            components_list.append(repo_data)
        components_dict = {}
        for c in components_list:
            params_2 = dlrnapi_client.Params2()
            params_2.commit_hash = c.commit_hash
            params_2.distro_hash = c.distro_hash
            components_dict[c.component] = [i.to_dict() for i in
                                            api_instance.api_repo_status_get(
                                                params_2)]

        return components_dict


if __name__ == "__main__":
    h = HashCollector()
    promotion_dict = h.get_component_promotions()
