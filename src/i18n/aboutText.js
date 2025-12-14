// src/i18n/aboutText.js
export const texts = {
  en: {
    about: {
      header: {
        title: "About Debre Genet Holy Trinity Church",
        subtitle:
          "An Ethiopian Orthodox Tewahedo parish in London—preserving ancient faith, serving a living community, and safeguarding a historic Grade II listed church building.",
      },

      hero: {
        badge: "Ethiopian Orthodox Tewahedo Church",
        heading: "Ancient Faith. Living Community. Historic Home.",
        lead:
          "Established in London in 2006, Debre Genet Holy Trinity Church welcomes all who come to worship, learn, and grow in Orthodox Christian life.",
        // (You’re not using these now since Visit section is removed, but safe to keep)
        ctaPrimary: "Contact",
        ctaSecondary: "Restoration Appeal",
      },

      aboutUs: {
        title: "About Us",
        p1: `Debre Genet Holy Trinity Church is a parish of the Ethiopian Orthodox Tewahedo Church,
one of the world’s most ancient Christian traditions, with roots extending to early Judaic
practice and the first centuries of Christianity. The Church’s faith, liturgy, language, music,
and spiritual customs have been preserved continuously from antiquity to the present day.`,
        p2: `Established in London in 2006, Debre Genet Holy Trinity Church operates under the
Archbishop for the Diocese of the UK and Ireland. It serves as a spiritual home for the
Ethiopian Orthodox Christian community in the UK and welcomes people of diverse
backgrounds who come to worship, learn, and participate in community life. Worship is
conducted through ancient rites using Ge’ez and Amharic, maintaining a living link to the
earliest expressions of Christian faith.`,
        p3: `The Church is deeply committed to pastoral care, education, and social responsibility. It
provides regular liturgical services, Sunday School, Bible study, counselling, and pastoral
support for families, young people, the elderly, and the vulnerable. A strong focus is placed
on youth development, guiding young people to build moral integrity, responsibility, and
positive engagement with wider society.`,
        p4: `Debre Genet Holy Trinity Church also preserves and shares Ethiopia’s rich cultural heritage,
including sacred music, liturgical poetry, language, and traditions. Based in a Grade II listed
building, the Church represents both a place of worship and an important cultural presence
in the United Kingdom, contributing to faith life, community cohesion, and the safeguarding
of global Christian heritage.`,
        notesTitle: "Good to add",
        notes: [
          "Your actual liturgy and congregation photos",
          "Exterior and interior images of your Grade II listed building",
        ],
      },

      leadership: {
        title: "Our Clergy & Leadership",
        intro: `Debre Genet Holy Trinity Church operates under the authority of the Archbishop for the
Diocese of the UK and Ireland. The parish is served by ordained clergy supported by a
dedicated church council and volunteers.`,
        commitmentsTitle: "Leadership is committed to:",
        commitments: [
          "Upholding Orthodox faith and discipline",
          "Providing pastoral care and guidance",
          "Ensuring safeguarding and accountability",
          "Serving the spiritual and practical needs of the congregation",
        ],
        clergyTitle: "Clergy (London Parish)",
        // ✅ UPDATED: objects so your hierarchy UI can render roles/badges cleanly
        clergy: [
          { name: "Rev Kefeyalew Aschalew", role: "Priest" },
          { name: "Rev Addis Gebrekidan", role: "Priest" },
          { name: "Rev Fisseha Teferi", role: "Priest" },
          { name: "Rev Kibret Asnakew", role: "Priest" },
          { name: "Kesis Samuel", role: "Kesis" },
          { name: "Kesis Kaleb", role: "Kesis" },
        ],
      },

      youth: {
        title: "Youth & Education",
        p1: `Education is central to the mission of the Ethiopian Orthodox Tewahedo Church. We provide
structured learning through Sunday School, Bible study, and youth programmes that support
spiritual growth and personal development.`,
        p2: `Young people are guided to develop strong moral foundations, resilience, and responsibility.
Through mentorship, faith-based teaching, and positive activities, we work to prevent social
isolation, substance misuse, and antisocial behaviour.`,
        p3: `Youth are actively encouraged to serve their community and develop leadership skills.`,
        extras: "Pictures to add: Sunday School, Begena, Kirrar, and Mezmure.",
      },

      safeguarding: {
        title: "Safeguarding & Wellbeing",
        p1: `The Church is fully committed to safeguarding children, young people, and vulnerable adults.
We operate safeguarding policies in line with UK best practice and ensure that clergy,
volunteers, and leaders receive appropriate guidance.`,
        p2: `The wellbeing of every person in our care is treated with the utmost seriousness and respect.`,
        note:
          "We will add our safeguarding policy, and the picture/position of the responsible person.",
      },

      // ✅ VISIT removed (you said not needed)
      // visit: { ... }  <-- deleted

      restoration: {
        title: "Restoration Appeal",
        subtitle:
          "Preserving an Ancient Faith, a Historic Building, and a Living Community",

        body: [
          `Debre Genet Holy Trinity Church is a parish of the Ethiopian Orthodox Tewahedo
Church—one of the world’s most ancient Christian traditions, with roots extending to
early Judaic practice and the earliest centuries of Christianity. Established in London
in 2006, the Church has since been dedicated to proclaiming the message of Christ
through worship, pastoral care, education, and service to the wider community.`,
          `The Church provides regular liturgical services, counselling and guidance to families
and vulnerable young adults, and pastoral visits to the sick, housebound, and elderly.
It also plays an active role in youth development and community outreach, ensuring
faith is lived through compassion, responsibility, and service.`,
        ],

        buildingTitle: "The Building and Its Significance",
        buildingBody: [
          `In March 2019, following several years of fundraising and supported by a bank loan,
the Church acquired St Michael’s Church, Cricklewood (NW2 6XG) as its
permanent place of worship. The building is a stone-built, Grade II listed church,
constructed between 1907 and 1909, and is recognised for its architectural and
heritage value.`,
          `Today, the building plays a unique role: it is not only a historic British church but also
a living centre for Ethiopian Orthodox worship in the United Kingdom. Within its
walls, ancient liturgy, sacred chant (Zema), liturgical poetry (Qene), language, and
spiritual traditions continue to be practised and passed on to future generations.`,
        ],

        conditionTitle: "Condition of the Building and Need for Restoration",
        conditionBody: [
          `Prior to acquisition, the building had suffered from long-term structural
deterioration. Years of foundation movement resulted in cracking to stone walls,
piers, arches, and window mullions. There is also significant evidence of water
ingress through the roofs, parapet gutters, and stonework. Temporary internal and
external steel support structures were installed decades ago to stabilise cracked
stone pillars on the front elevation.`,
          `A Building Survey Report (February 2019) identified a number of urgent repairs
necessary to stabilise and regenerate the building. In May 2019, Historic England
assessed the church as “Heritage at Risk”, formally recognising its vulnerable
condition.`,
        ],

        scopeTitle: "Scope of the Restoration Project",
        scope: [
          {
            title: "1) Roof Restoration",
            text: `Restoration of the main and subsidiary roofs, including replacement of flat roof and
built-up felt coverings, renewal of roof decks, installation of insulation, chemical
treatment of exposed timbers, and repair or replacement of rainwater goods.`,
          },
          {
            title: "2) Stonework Conservation",
            text: `Assessment and repair of structural cracks in walls, piers, and arches; restoration of
eroded stonework; repair of defective mortar joints; and overhaul of chimneys.`,
          },
          {
            title: "3) Structural and Architectural Repairs",
            text: `Repair of front elevation window mullions and the baptistery arch, enabling the safe
removal of long-standing temporary steel support frames, alongside necessary
underpinning works to the front and rear elevations.`,
          },
        ],

        benefitTitle: "Community and Public Benefit",
        benefitBody: [
          `On completion, the restored building will provide a safe, stable, and welcoming
environment for worship, reflection, celebration, mourning, and community
gathering.`,
          `The project will also improve the appearance and safety of the surrounding
environment, contributing positively to the wellbeing of the wider neighbourhood.`,
        ],
        benefitBullets: [
          "Elderly and housebound individuals",
          "Vulnerable adults and families",
          "Children and young people receiving guidance and support",
        ],

        sharedTitle: "A Shared Responsibility",
        sharedBody: `This restoration is not simply about repairing a historic structure—it is about
preserving faith, identity, culture, and service for present and future generations.`,

        supportTitle: "How You Can Support the Restoration Appeal",
        supportBullets: [
          "Donations",
          "Grant funding and sponsorship",
          "Professional expertise and skills",
          "Volunteering and advocacy",
        ],

        donateTitle: "Donate",
        donateLink: "https://donate.mydona.com/debre-genet-church-london",
        closing:
          "Together, we can restore a historic building, protect a unique heritage, and strengthen a living community.",
      },
    },
  },

  // You can translate later — structure is ready.
  am: {
    about: {
      header: {
        title: "ስለ ደብረ ገነት ቅዱስ ሥላሴ ቤተክርስቲያን",
        subtitle:
          "በለንደን የሚገኝ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን አብያተ ክርስቲያናት መካከል የእምነትና የማኅበረሰብ መሠረት የሆነ መንፈሳዊ ቤት።",
      },

      hero: {
        badge: "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን",
        heading: "ጥንታዊ እምነት። ሕያው ማኅበረሰብ። ታሪካዊ ቤተ ክርስቲያን።",
        lead:
          "በ2006 በለንደን የተመሠረተች ቤተክርስቲያናችን ለመጸለይ እና ለመማር የሚመጡ ሁሉንም በፍቅር ትቀበላለች።",
        ctaPrimary: "አግኙን",
        ctaSecondary: "የግንባታ ጥሪ",
      },

      aboutUs: {
        title: "ስለ እኛ",
        p1: `ይህ ገጽ የእንግሊዝኛው ጽሑፍ ትርጉም ሲዘጋጅ እዚህ ይቀመጣል።`,
        p2: `—`,
        p3: `—`,
        p4: `—`,
        notesTitle: "ማከል የሚመከር",
        notes: [
          "የአምላክ አገልግሎት እና የማኅበረሰብ ፎቶዎች",
          "የውጭ/ውስጥ ፎቶዎች",
        ],
      },

      leadership: {
        title: "ካህናትና መሪነት",
        intro: `—`,
        commitmentsTitle: "መሪነት ቁርጠኝነት",
        commitments: ["—", "—", "—", "—"],
        clergyTitle: "ካህናት (ለንደን ፓሪሻ)",
        // ✅ keep same object shape for future translation consistency
        clergy: [
          { name: "Rev Kefeyalew Aschalew", role: "Priest" },
          { name: "Rev Addis Gebrekidan", role: "Priest" },
          { name: "Rev Fisseha Teferi", role: "Priest" },
          { name: "Rev Kibret Asnakew", role: "Priest" },
          { name: "Kesis Samuel", role: "Kesis" },
          { name: "Kesis Kaleb", role: "Kesis" },
        ],
      },

      youth: {
        title: "ወጣቶችና ትምህርት",
        p1: "—",
        p2: "—",
        p3: "—",
        extras: "—",
      },

      safeguarding: {
        title: "ደህንነትና ጥበቃ",
        p1: "—",
        p2: "—",
        note: "—",
      },

      restoration: {
        title: "የግንባታ ጥሪ",
        subtitle: "—",
        body: ["—"],
        buildingTitle: "—",
        buildingBody: ["—"],
        conditionTitle: "—",
        conditionBody: ["—"],
        scopeTitle: "—",
        scope: [],
        benefitTitle: "—",
        benefitBody: ["—"],
        benefitBullets: [],
        sharedTitle: "—",
        sharedBody: "—",
        supportTitle: "—",
        supportBullets: [],
        donateTitle: "Donate",
        donateLink: "https://donate.mydona.com/debre-genet-church-london",
        closing: "—",
      },
    },
  },
};
