# Getting Started
Quick and dirty topic modeling + pyldavis.

After cloning the whole contact-centre-study repo do the following.

Example for Ubuntu.

1. Navigate into `/contact-centre-study/pyldavis/topic-modelling/`

2. Follow the instructions under Pre-requisites and Preparation to setup the environment to run MALLET for topic modeling. **Note** - you ignore step 1 under Preparation as this contact-centre-study repo contains a fork of the mentioned repo (ie. the directory "topic-modelling" which we are currently in).

3. Navigate back to `/contact-centre-study/pyldavis/`

4. Run the `create_text_files.py` script. **Note** - edit line 33 to select for what CSAT you want. The current code is selecting for only incidents that have a CSAT of 1.

`python create_text_files.py -pickle mydataset.pickle`
* This will generate a text file containing the concatenated dialogue of the incidents you have selected.

5. Navigate back into `/contact-centre-study/pyldavis/topic-modelling/` and follow the instructions under the Scripts section in the README. 
* You will first run `import.js` now that you have populated the `dataset` directory.
* You will then run `train.js` to generate a topic model.

6. Navigate back into `/contact-centre-study/pyldavis/` and run the `transform_mallet_to_pyldavis.py` script.
* Make sure to update lines 66 and 72 with the path to your own modelling directory.

`python transform_mallet_to_pyldavis.py`
* This will generate pyldavis html files in the current directory which you can open in any browser to view.

# Mentions

This projct utilized code from https://github.com/ashish-chopra/topic-modelling for topic modelling and https://jeriwieringa.com/2018/07/17/pyLDAviz-and-Mallet/ for converting MALLET output into a pyldavis vis.

