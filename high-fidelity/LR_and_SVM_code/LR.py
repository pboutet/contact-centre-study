#python3.8.3
"""

sklearn LR implementation

"""
__author__ = 'Patrick Boutet'


# Imports
import pandas as pd
import numpy as np
import pickle

from utils import *

import sklearn
from sklearn import metrics
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier


# Global Variables
train = pd.read_csv('../hedwig-data/datasets/lulu/train.tsv',sep='\t',header=None,dtype={0:str,1:str})
dev = pd.read_csv('../hedwig-data/datasets/lulu/dev.tsv',sep='\t',header=None,dtype={0:str,1:str})
test = pd.read_csv('../hedwig-data/datasets/lulu/test.tsv',sep='\t',header=None,dtype={0:str,1:str})

# Class Declarations

def vectorize_labels(df):
    y = []
    counter = 0
    for label in df[0]:
        counter += 1

        if label == '00001':
            y.append(5)
        elif label == '00010':
            y.append(4)
        elif label == '00100':
            y.append(3)
        elif label == '01000':
            y.append(2)
        elif label == '10000':
            y.append(1)
        else:
            print(label)
            
    return np.array(y)

def train_lr():

    tfidf_vectorizer = TfidfVectorizer()

    train_X = tfidf_vectorizer.fit_transform(train[1])
    train_y = vectorize_labels(train)

    dev_X = tfidf_vectorizer.transform(dev[1])
    dev_y = vectorize_labels(dev)

    test_X = tfidf_vectorizer.transform(test[1])
    test_y = vectorize_labels(test)

    lr = OneVsRestClassifier(LogisticRegression())
    lr.fit(train_X, train_y)

    dev_pred = lr.predict(dev_X)
    test_pred = lr.predict(test_X)
    
    return clf, dev_y, test_y, dev_pred, test_pred

def main():

    clf, dev_y, test_y, dev_pred, test_pred = train_lr()
    print(metrics.accuracy_score(dev_y, dev_pred),metrics.f1_score(dev_y, dev_pred, average='micro'))
    print (metrics.classification_report(dev_y, dev_pred))
    print(metrics.accuracy_score(test_y, test_pred),metrics.f1_score(test_y, test_pred, average='micro'))
    print (metrics.classification_report(test_y, test_pred))

# Main body
if __name__ == '__main__':
    main()