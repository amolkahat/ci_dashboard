from dlrn_client import DlrnClient, DlrnClientConfig


class HashCollector:
    """
    Hash collector class will collect hashes and update
    jobs and to it.
    """
    def __init__(self, config):
        self.config = config
        self.hash_dict = {}

    def get_promotions(self, label='tripleo-ci-testing'):
        """
        Fetch promotion for given label
        :param label:
        :return:
        """
        config = DlrnClientConfig(
            dlrnauth_username='ciuser',
            dlrnauth_password='',
            api_url='http://trunk.rdoproject.org/api-centos9-master-uc/')
        d = DlrnClient(config)
        promotions = d.fetch_promotions(label)

        return promotions

    def update_jobs(self):
        """
        Update jobs
        :return:
        """
        promotions = self.get_promotions()
        for promotion in promotions:
            if promotion.aggregate_hash in self.hash_dict.keys():
                if not promotion.dump_to_dict() in \
                       self.hash_dict[promotion.aggregate_hash]:
                    self.hash_dict[
                        promotion.aggregate_hash].append(
                        promotion.dump_to_dict)
