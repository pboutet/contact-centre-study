# Customer Satisfaction Score (CSAT) Classification

This repo contains the code to evaluate differnt models for classifying CSAT for live chat text.

It is an extension of the [original Hedwig](https://github.com/castorini/hedwig) library and a [modified Hedwig libarary](https://github.com/dki-lab/covid19-classification) where [DocBERT](https://arxiv.org/abs/1904.08398) has been adapted to use the [Longformer](https://github.com/allenai/longformer) model. 

The libraries have been updated to import our custom live chat dataset and work with the latest version of Pytorch and the Transformers library.

## Getting Started

Creat a conda env use python version 3.8.3
```
conda create --name castor python=3.8.3
source activate castor
```

Clone the repo

```
git clone git@github.com:pboutet/contact-centre-study.git
```

Navigate into /contact-centre-study/high-fidelity/

```
cd contact-centre-study/high-fidelity/
```

Create a directory called hedwig-data

```
mkdir headwig-data
```

Then create a directory called datasets.

```
mkdir headwig-data/datasets
```

Then create a directory called datasets. This is where you will put your train, dev, test TSV files in the hedwig format.

```
mkdir headwig-data/datasets/lulu
```

Install all python packages
```
pip install -r requirements.txt
```

Code depends on data from NLTK (e.g., stopwords) so you'll have to download them. Run the Python interpreter and type the commands:
```
import nltk
nltk.download()
```

## Word Embeddings Setup

Download the word2vec embeddings for the traditional deep learning models.

Follow these instructions from the [Hedwig](https://github.com/castorini/hedwig#datasets) repo to download the embeddings. The only files this repo will need will be under:
```
hedwig-data/embeddings
```

Option 1. Hedwig Wasabi-hosted mirror:
```
$ wget http://nlp.rocks/hedwig -O hedwig-data.zip
$ unzip hedwig-data.zip
```
Option 2. Hedwig school-hosted repository, [hedwig-data](https://git.uwaterloo.ca/jimmylin/hedwig-data):
```
$ git clone https://git.uwaterloo.ca/jimmylin/hedwig-data.git
```

After cloning the hedwig-data repo, you need to unzip the embeddings:
```
cd hedwig-data/embeddings/word2vec 
tar -xvzf GoogleNews-vectors-negative300.tgz
```

## Pre-Trained Longformer Setup

Run the following commands to download the pre-trained Longformer from their original repo.
```
cd hedwig
wget https://ai2-s2-research.s3-us-west-2.amazonaws.com/longformer/longformer-base-4096.tar.gz
tar -xvzf longformer-base-4096.tar.gz
```

## Running Models

Navigate into the hedwig directory.

```
cd hedwig
```

### Longformer

```
python -m models.longformer --dataset lulu --model longformer-base --max-seq-length 1024 --batch-size 16 --lr 2e-5 --epochs 30
```

### DocBERT

```
python -m models.bert --dataset lulu --model bert-base-uncased --max-seq-length 512 --batch-size 16 --lr 2e-5 --epochs 30
```

### HAN

```
python -m models.han --dataset lulu --mode static --batch-size 32 --lr 0.001 --epochs 30 --seed 3435
```

### KimCNN

```
python -m models.kim_cnn --mode static --dataset lulu --batch-size 32 --lr 0.001 --epochs 30 --dropout 0.1 --seed 3435
```

### Bi-LSTM-reg

```
python -m models.reg_lstm --dataset lulu --mode static --batch-size 32 --lr 0.001 --epochs 30 --bidirectional --num-layers 1 --hidden-dim 512 --wdrop 0.1 --embed-droprate 0.2 --dropout 0.5 --beta-ema 0.99 --seed 3435
```

### LR

Navigate into the LR_and_SVM_code directory.
 
```
cd hedwig/LR_and_SVM_code
```

Then run.

```
python LR.py
```

### SVM

Navigate into the LR_and_SVM_code directory.
 
```
cd hedwig/LR_and_SVM_code
```

Then run.

```
python SVM.py
```


## Edit Notice
All files in this directory were edited from their originals in https://github.com/castorini/hedwig and https://github.com/dki-lab/covid19-classification by Patrick Boutet (https://github.com/pboutet) between Jan 2021 and Nov 2022.