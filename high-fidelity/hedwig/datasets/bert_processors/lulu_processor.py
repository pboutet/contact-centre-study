import os

from datasets.bert_processors.abstract_processor import BertProcessor, InputExample


class luluProcessor(BertProcessor):
    NAME = 'lulu'
    NUM_CLASSES = 5
    IS_MULTILABEL = False

    def get_train_examples(self, data_dir, filename='train.tsv'):
        return self._create_examples(
            self._read_tsv(os.path.join(data_dir, 'lulu', filename)), 'train')

    def get_dev_examples(self, data_dir, filename='dev.tsv'):
        return self._create_examples(
            self._read_tsv(os.path.join(data_dir, 'lulu', filename)), 'dev')

    def get_test_examples(self, data_dir, filename='test.tsv'):
        return self._create_examples(
            self._read_tsv(os.path.join(data_dir, 'lulu', filename)), 'test')

 
    def _create_examples(self, lines, set_type):
        examples = []
        for (i, line) in enumerate(lines):
            guid = '%s-%s' % (set_type, i)
            text_a = line[1]
            label = line[0]
            examples.append(
                InputExample(guid=guid, text_a=text_a, text_b=None, label=label))
        return examples