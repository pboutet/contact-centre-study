import numpy as np
import torch
import torch.nn.functional as F
from sklearn import metrics

from common.evaluators.evaluator import Evaluator
import pickle
import os

class ClassificationEvaluator(Evaluator):

    def __init__(self, dataset_cls, model, embedding, data_loader, batch_size, device, keep_results=False,args=None):
        super().__init__(dataset_cls, model, embedding, data_loader, batch_size, device, keep_results, args)
        self.ignore_lengths = False
        self.is_multilabel = False

        self.args = args

    def get_scores(self):
        self.model.eval()
        self.data_loader.init_epoch()
        total_loss = 0

        if hasattr(self.model, 'beta_ema') and self.model.beta_ema > 0:
            # Temporal averaging
            old_params = self.model.get_params()
            self.model.load_ema_params()

        predicted_labels, target_labels = list(), list()
        for batch_idx, batch in enumerate(self.data_loader):
            if hasattr(self.model, 'tar') and self.model.tar:
                if self.ignore_lengths:
                    scores, rnn_outs = self.model(batch.text)
                else:
                    scores, rnn_outs = self.model(batch.text[0], lengths=batch.text[1])
            else:
                if self.ignore_lengths:
                    scores = self.model(batch.text)
                else:
                    scores = self.model(batch.text[0], lengths=batch.text[1])

            if self.is_multilabel:
                scores_rounded = F.sigmoid(scores).round().long()
                predicted_labels.extend(scores_rounded.cpu().detach().numpy())
                target_labels.extend(batch.label.cpu().detach().numpy())
                total_loss += F.binary_cross_entropy_with_logits(scores, batch.label.float(), size_average=False).item()
            else:
                predicted_labels.extend(torch.argmax(scores, dim=1).cpu().detach().numpy())
                target_labels.extend(torch.argmax(batch.label, dim=1).cpu().detach().numpy())
                total_loss += F.cross_entropy(scores, torch.argmax(batch.label, dim=1), size_average=False).item()

            if hasattr(self.model, 'tar') and self.model.tar:
                # Temporal activation regularization
                total_loss += (rnn_outs[1:] - rnn_outs[:-1]).pow(2).mean()

        predicted_labels = np.array(predicted_labels)
        target_labels = np.array(target_labels)

        if self.args is not None:
            pickle.dump((predicted_labels, target_labels),open(os.path.join(self.args.data_dir,self.args.dataset,'{}_{}_{}_predictions.p'.format(self.split,self.args.model,self.args.training_file)),'wb'))

        accuracy = metrics.accuracy_score(target_labels, predicted_labels)
        precision = metrics.precision_score(target_labels, predicted_labels, average='micro')
        recall = metrics.recall_score(target_labels, predicted_labels, average='micro')
        f1 = metrics.f1_score(target_labels, predicted_labels, average='micro')
        avg_loss = total_loss / len(self.data_loader.dataset.examples)
        report = metrics.classification_report(target_labels, predicted_labels)#added classification report

        if self.args is not None:
            pickle.dump(([accuracy, precision, recall, f1, avg_loss], ['accuracy', 'precision', 'recall', 'f1', 'avg_loss']),open(os.path.join(self.args.data_dir,self.args.dataset,'{}_{}_{}_metrics.p'.format(self.split,self.args.model,self.args.training_file)),'wb'))

        if hasattr(self.model, 'beta_ema') and self.model.beta_ema > 0:
            # Temporal averaging
            self.model.load_params(old_params)

        return [accuracy, precision, recall, f1, avg_loss, report], ['accuracy', 'precision', 'recall', 'f1', 'cross_entropy_loss', 'classification_report']#added classification report to return