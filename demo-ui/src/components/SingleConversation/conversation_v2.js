const conversation = {
  "agent_name": "Kailee Miller",
  "datetime": "July 15, 2021, 9:06am",
  "num_stars": 1,
  "messages": [
    {
      "speaker": "agent",
      "sentiment_border": "yellow",
      "datetime": "July 15, 2021, 9:06am",
      "text": "Hi there!",
      "sentiment_highlight": [
        {
          "sentiment_group": "light",
          "start": 0,
          "end": 1
        },
        {
          "sentiment_group": "med",
          "start": 3,
          "end": 7
        },
        {
          "sentiment_group": "dark",
          "start": 8,
          "end": 8
        },
      ],
      "entities": []
    },
    {
      "speaker": "customer",
      "sentiment_border": "red",
      "datetime": "July 15, 2021, 9:07am",
      "text": "Fedex shipping sucks",
      "sentiment_highlight": [
        {
          "sentiment_group": "dark",
          "start": 15,
          "end": 19
        }
      ],
      "entities": [
        {
          "entity_group": "ORG",
          "start": 0,
          "end": 4
        }
      ]
    },
    {
      "speaker": "customer",
      "sentiment_border": "red",
      "datetime": "July 15, 2021, 9:07am",
      "text": "Pack my box with five dozen liquor jugs",
      "sentiment_highlight": [
        {
          "sentiment_group": "dark",
          "start": 0,
          "end": 3
        },
        {
          "sentiment_group": "med",
          "start": 5,
          "end": 8
        }
      ],
      "entities": [
        {
          "entity_group": "MISC",
          "start": 28,
          "end": 33
        },
        {
          "entity_group": "PER",
          "start": 5,
          "end": 6
        }
      ]
    },
    {
      "speaker": "agent",
      "sentiment_border": "green",
      "datetime": "July 15, 2021, 9:08am",
      "text": "They wandered into a strange Tiki bar on the edge of the small beach town.",
      "sentiment_highlight": [],
      "entities": [
        {
          "entity_group": "LOC",
          "start": 21,
          "end": 36
        }
      ]
    }
  ]
};

export default conversation;

// at a base level it does 4 types of entities: location (LOC), organizations (ORG), person (PER) and Miscellaneous (MISC)