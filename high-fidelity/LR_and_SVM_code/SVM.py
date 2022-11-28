#python3.8.3
"""

sklearn linear SVM implementation

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

#randomly drop 90% of rows that have a csat of 5 to reduce our trainng data
five_star_entries_indices = train.index[train[0] == '00001']
# choose 90% randomly
dropIndices = np.random.choice(five_star_entries_indices, size = int(len(five_star_entries_indices)*0.9))
# drop them
train.drop(dropIndices, axis=0, inplace=True)

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

def train_svm():

    tfidf_vectorizer = TfidfVectorizer()

    train_X = tfidf_vectorizer.fit_transform(train[1])
    train_y = vectorize_labels(train)

    dev_X = tfidf_vectorizer.transform(dev[1])
    dev_y = vectorize_labels(dev)

    test_X = tfidf_vectorizer.transform(test[1])
    test_y = vectorize_labels(test)

    clf = OneVsRestClassifier(SVC(kernel='linear'), n_jobs=-1)#added n_jobs=-1 to use all available cores
    train_X.sort_indices()#https://github.com/scikit-learn/scikit-learn/issues/6614
    clf.fit(train_X, train_y)

    dev_pred = clf.predict(dev_X)
    test_pred = clf.predict(test_X)
    
    return clf, dev_y, test_y, dev_pred, test_pred

def main():

    clf, dev_y, test_y, dev_pred, test_pred = train_svm()
    print(metrics.accuracy_score(dev_y, dev_pred),metrics.f1_score(dev_y, dev_pred, average='micro'))
    print (metrics.classification_report(dev_y, dev_pred))
    print(metrics.accuracy_score(test_y, test_pred),metrics.f1_score(test_y, test_pred, average='micro'))
    print (metrics.classification_report(test_y, test_pred))

# Main body
if __name__ == '__main__':
    main()