#!/user/bin/python3.8.1
"""
Load our pickle file with incident data and select the subset we want 
then create text files for each incident and write them to disk.

Make sure numpy is installed.
"""
__author__ = 'Patrick Boutet'

# Imports
import os.path
import argparse
import pickle


def main():
    #change the path to where you want the text files saved
    #category 895, product issue, 
    save_path = "topic-modelling/dataset/"

    #get input file
    parser = argparse.ArgumentParser()
    parser.add_argument("-pickle", "--picklefile", help="filepath of input picke file")
    args = parser.parse_args()

    #loop through each of the incidents
    with open(args.picklefile, 'rb') as pickle_file:
        incidents_dict = pickle.load(pickle_file)
        print("Number of incidents in datset: ", len(incidents_dict))
        for key, value in incidents_dict.items():
            
            #only select one star incidents
            if value["Stella Data"][0]["Star Rating"] != 1:
                continue

            #concatenate all the customer and agent messages into one string
            full_message_text_list = []
            for i, turn in enumerate(value["Chat Data"]["Text"]):
                if turn[0] == 'System':
                    continue
                full_message_text_list.append(turn[2])

            document = ' '.join(full_message_text_list)

            #perform last check on if the document has sufficient lenght to actually process, if not skip this row
            if document == "" or len(document) <= 10:
                print(key, " Document: ", document)
                continue

            completeFileName = os.path.join(save_path, str(key)+".txt") 
            with open(completeFileName, 'w') as output:
                output.write(document)

        

# Main body
if __name__ == '__main__':
    main()