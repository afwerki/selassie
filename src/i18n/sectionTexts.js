// src/i18n/sectionTexts.js

export const sectionTexts = {
  en: {
    sermons: {
      sectionTitle: "Teachings & Sermons",
      sectionIntro:
        "Grow deeper in faith through sermons, written teachings, and reflections from Selassie Ethiopian Orthodox Church.",

      tabs: {
        videos: "Videos",
        teachings: "Written Teachings",
        quiz: "Q & A Quiz",
      },

      videos: {
        items: [
          {
            id: "v1",
            title: "The Mystery of the Holy Trinity",
            meta: "Feast of Selassie · Teaching 1",
            description:
              "A teaching on the Holy Trinity and how this mystery is celebrated in the liturgy and life of the Church.",
          },
          {
            id: "v2",
            title: "Faith in Times of Trial",
            meta: "Sunday Liturgy · Teaching 2",
            description:
              "Reflecting on the lives of the saints and how they held fast to Christ through suffering and hardship.",
          },
          {
            id: "v3",
            title: "The Gift of Repentance",
            meta: "Lenten Series · Teaching 3",
            description:
              "Exploring the meaning of repentance in the Orthodox tradition and how confession heals the soul.",
          },
          {
            id: "v4",
            title: "Living the Gospel Daily",
            meta: "Teaching Series · Lesson 4",
            description:
              "Practical reflections on how we can live out the Gospel in our families, work, and community life.",
          },
        ],
      },

      teachings: {
        cards: [
          {
            id: "t1",
            tag: "Doctrine",
            title: "The Incarnation of Christ",
            meta: "Study Note · 8 min read",
            body: "How the Word of God became flesh for our salvation, and why the Incarnation is at the heart of our faith and worship.",
          },
          {
            id: "t2",
            tag: "Liturgy",
            title: "Understanding the Divine Liturgy",
            meta: "Guided Walkthrough · 10 min read",
            body: "A step-by-step guide through the Divine Liturgy of the Ethiopian Orthodox Church with short explanations.",
          },
          {
            id: "t3",
            tag: "Spiritual Life",
            title: "Prayer in the Orthodox Tradition",
            meta: "Reflection · 6 min read",
            body: "Simple practices to deepen our daily prayer life, rooted in the Psalms and the prayers of the saints.",
          },
        ],
      },

      quiz: {
        setsTitle: "Quiz sets",
        setsIntro:
          'Choose a quiz set to begin. Newest quizzes appear first. On mobile, you\'ll see two at a time with "Show more".',
        loadingLabel: "Loading quiz sets from the church CMS…",
        emptyLabel:
          "No quiz sets have been published yet. Please check back soon.",
        showMoreLabel: "Show more quiz sets",

        backToSetsLabel: "← Back to quiz sets",

        headerIntro:
          "Take your time. Choose an answer, see the explanation, then move on when you're ready.",

        reactionCorrect: "Correct! Beautiful answer.",
        reactionIncorrect:
          "Not quite this time — keep going, you’re learning.",

        explanationLabel: "Explanation:",

        nextQuestionLabel: "Next question",
        seeResultsLabel: "See my results",

        resultTitle: "Well done!",
        resultScorePrefix: "You scored",
        resultBody:
          "Keep exploring the teachings and feel free to try the quiz again or watch the sermons above.",
        restartLabel: "Restart this quiz",

        // Static fallback quiz (used only if CMS fails)
        fallbackTitle: "Faith basics quiz",
        fallbackQuestions: [
          {
            id: "q1",
            question: "What do we confess about the Holy Trinity?",
            difficulty: "Beginner",
            explanation:
              "In Orthodox teaching, we confess one God in three co-equal, co-eternal Persons: the Father, the Son, and the Holy Spirit.",
            options: [
              {
                id: "q1a",
                label: "Three gods who work together closely",
                isCorrect: false,
              },
              {
                id: "q1b",
                label: "One God in three co-equal, co-eternal Persons",
                isCorrect: true,
              },
              {
                id: "q1c",
                label: "One God who changes form over time",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    },

    events: {
      sectionTitle: "Church Calendar & Events",
      sectionIntro:
        "Here you can find upcoming feast days, special services, and community activities at Selassie Church.",
      upcoming: [
        {
          id: "e1",
          day: "14",
          month: "DEC",
          title: "Christmas Vigil & Liturgy",
          meta: "From 10:00 PM · Church Sanctuary",
          description:
            "All-night vigil with hymns, readings, and the celebration of the Divine Liturgy at dawn.",
        },
        {
          id: "e2",
          day: "05",
          month: "JAN",
          title: "Youth Fellowship Evening",
          meta: "6:30 PM · Community Hall",
          description:
            "Teaching, worship, and discussion for young people in our parish.",
        },
        {
          id: "e3",
          day: "19",
          month: "JAN",
          title: "Charity Food Drive",
          meta: "After Sunday Liturgy",
          description:
            "Collecting food and essentials for vulnerable families in our local community.",
        },
      ],
    },
  },

  am: {
    sermons: {
      sectionTitle: "ትምህርቶችና የመስተዋት ቃላት",
      sectionIntro:
        "በትምህርቶች፣ በተጻፉ መመሪያዎችና በማስተዋል መመሪያዎች በኩል በእምነት ውስጥ በጥልቀት ተድባብሩ።",

      tabs: {
        videos: "ቪዲዮዎች",
        teachings: "የተጻፉ ትምህርቶች",
        quiz: "ጥያቄና መልስ (Quiz)",
      },

      videos: {
        items: [
          {
            id: "v1",
            title: "የቅዱስ ሥላሴ ምሥጢር",
            meta: "የሥላሴ በዓል · ትምህርት 1",
            description:
              "የቅዱስ ሥላሴን ምሥጢር በቅዳሴ እና በቤተክርስቲያን ሕይወት ውስጥ እንዴት እንደምንከብር የሚያብራራ ትምህርት።",
          },
          {
            id: "v2",
            title: "በሙሉ በፈተና ዘመን እምነትን መጠበቅ",
            meta: "የእሁድ ቅዳሴ · ትምህርት 2",
            description:
              "ቅዱሳን በመከራ ዘመን እስከመጨረሻ እምነታቸውን እንዴት እንደጠበቁ የሚያስታውስ ትምህርት።",
          },
          {
            id: "v3",
            title: "የንስሐ ስጦታ",
            meta: "የጾም ትምህርቶች · ትምህርት 3",
            description:
              "በኦርቶዶክስ ተምህርት ውስጥ ንስሐ ምንድን እንደሆነ እና መንፈሳዊ ሕይወታችንን እንዴት እንደሚፈውስ የሚያብራራ ትምህርት።",
          },
          {
            id: "v4",
            title: "ወንጌልን በዕለታት ሕይወት መኖር",
            meta: "የትምህርት ተከታታይ · ትምህርት 4",
            description:
              "በቤተሰብ፣ በሥራ ቦታና በማኅበረሰብ ዕለታት ሕይወት ውስጥ ወንጌልን በተግባር እንዴት እንደምንኖር የሚያብራራ ትምህርት።",
          },
        ],
      },

      teachings: {
        cards: [
          {
            id: "t1",
            tag: "እምነት ትምህርት",
            title: "የክርስቶስ ሥጋ መለበስ",
            meta: "የትምህርት ማስታወሻ · 8 ደቂቃ ንባብ",
            body: "የእግዚአብሔር ቃል ስለእኛ ሰው ሆኖ ለመዳናችን እንዴት እንደሆነ እና የሥጋ መለበስ በእምነታችንና በአገልግሎታችን መሃል ቦታ እንዴት እንደሚያይ የሚያብራራ ጥቅስ።",
          },
          {
            id: "t2",
            tag: "ቅዳሴ",
            title: "ቅዱስ ቁርባንን መረዳት",
            meta: "መመሪያ አብራሪ · 10 ደቂቃ ንባብ",
            body: "የኢትዮጵያ ኦርቶዶክስ ቤተክርስቲያን ቅዱስ ቁርባንን በቀላሉ የሚያብራር እስከመጨረሻ የሚመራ መመሪያ።",
          },
          {
            id: "t3",
            tag: "መንፈሳዊ ሕይወት",
            title: "በኦርቶዶክስ ባሕል ጸሎት",
            meta: "ማስተዋል · 6 ደቂቃ ንባብ",
            body: "በመዝሙራትና በቅዱሳን ጸሎቶች ላይ የተመሰረቱ ቀላል የዕለታት ጸሎት ልምዶች፣ መንፈሳዊ ሕይወታችንን ለማጠናከር።",
          },
        ],
      },

      quiz: {
        setsTitle: "የጥያቄ ስብስቦች",
        setsIntro:
          "ጥያቄ ስብስብ ይምረጡና ይጀምሩ። አዲሱ መጀመሪያ ይታያል። በስልክ ላይ ሁለት ስብስቦች ብቻ በመጀመሪያ ይታያሉ፣ “ተጨማሪ አሳይ” በማለት ሌሎችን ማየት ትችላለህ።",
        loadingLabel: "ከቤተክርስቲያን CMS የጥያቄ ስብስቦች በመጫን ላይ…",
        emptyLabel:
          "የታተመ የጥያቄ ስብስብ የለም። እባክዎን በኋላ ደግመው ይመለሱ።",
        showMoreLabel: "ተጨማሪ የጥያቄ ስብስቦች አሳይ",

        backToSetsLabel: "← ወደ ጥያቄ ስብስቦች ተመለስ",

        headerIntro:
          "ጊዜዎን ወስዱ። መልስ ይምረጡ፣ ማብራሪያውን ያንብቡ እና በልብስ ሲዘጋጁ ወደ ቀጣይ ጥያቄ ይቀጥሉ።",

        reactionCorrect: "ትክክል ነው! ውብ መልስ ነው።",
        reactionIncorrect:
          "በዚህ ጊዜ ትክክል አልሆነም፣ ግን እየተማሩ ነው፣ ይቀጥሉ።",

        explanationLabel: "ማብራሪያ፦",

        nextQuestionLabel: "ወደ ቀጣዩ ጥያቄ",
        seeResultsLabel: "ውጤቴን አሳይ",

        resultTitle: "እጅግ ጥሩ!",
        resultScorePrefix: "ያገኙት ውጤት",
        resultBody:
          "ትምህርቶቹን በመቀጠል ይቀጥሉ፣ ጥያቄውን እንደገና መሞከር ወይም ከላይ ያሉትን ትምህርቶች ማየት ይችላሉ።",
        restartLabel: "ይህን ጥያቄ እንደገና ጀምር",

        fallbackTitle: "መሠረታዊ የእምነት ጥያቄ",
        fallbackQuestions: [
          {
            id: "q1",
            question: "ስለ ቅዱስ ሥላሴ ምን እንመሰክራለን?",
            difficulty: "መጀመሪያ ደረጃ",
            explanation:
              "በኦርቶዶክስ ትምህርት አንድ እግዚአብሔር በሦስት ተመሳሳይ ክብር ያላቸው፣ ዘላለማዊ በሆኑ በአብ፣ በወልድ እና በመንፈስ ቅዱስ ሦስቱ መንፈሳዊ አካላት እንመሰክራለን።",
            options: [
              {
                id: "q1a",
                label: "በአብረው የሚሠሩ ሦስት አማላጆች",
                isCorrect: false,
              },
              {
                id: "q1b",
                label:
                  "አንድ እግዚአብሔር በሦስት ተመሳሳይ ክብር ያላቸው አካላት",
                isCorrect: true,
              },
              {
                id: "q1c",
                label: "በዘመናት ውስጥ መልኩን የሚለውጥ አንድ እግዚአብሔር",
                isCorrect: false,
              },
            ],
          },
        ],
      },
    },

    events: {
      sectionTitle: "የቤተክርስቲያን ቀን መቁጠሪያ እና ፕሮግራሞች",
      sectionIntro:
        "በዚህ ቦታ በቤተክርስቲያናችን የሚካሄዱ ዋና በዓላት፣ ልዩ አገልግሎቶችና የማኅበረሰብ እንቅስቃሴዎችን ማግኘት ትችላላችሁ።",
      upcoming: [
        {
          id: "e1",
          day: "14",
          month: "ዲሴ",
          title: "የገና እኩለ ሌሊት ትንቢት እና ቅዳሴ",
          meta: "ጀምሮ 10:00 ከማታ · ቤተ ክርስቲያን",
          description:
            "በሙሉ ሌሊት በመዝሙርና በትንቢት እና በማኅበረ ቅዱሳን ቅዳሴ የምንያዝበት የጸሎት ጊዜ።",
        },
        {
          id: "e2",
          day: "05",
          month: "ጃን",
          title: "የወጣቶች መድረክ ምሽት",
          meta: "6:30 ከመሺያ · ማኅበረ ቅዱሳን ክፍል",
          description:
            "ለወጣቶች የትምህርት፣ የመዝሙርና የውይይት ጊዜ፣ በእምነት እድገታቸው ለመርዳት።",
        },
        {
          id: "e3",
          day: "19",
          month: "ጃን",
          title: "የምግብና መልበስ ድጋፍ መሰብሰቢያ",
          meta: "ከእሁድ ቅዳሴ በኋላ",
          description:
            "ለችግኝ ውስጥ ያሉ ቤተሰቦች ምግብና መልበስ እና የመጀመሪያ ደረጃ እርዳታ መሰብሰብ።",
        },
      ],
    },
  },
};
