import React, { useState } from "react";
import "../styling/about.css";
import Abune_Matthias from '../assets/images/Abune_Matthias.jpg'
import eotc from '../assets/images/eotc.jpg'
import selasssie from '../assets/images/selassie.png'
import prist from '../assets/images/prist.jpeg'

function About() {
  const [showMore, setShowMore] = useState(false);

  return (
    <main className="page" id="about">
      <section className="section-header">
        <h2>About Selassie Church</h2>
        <p>
          Learn more about our parish, our history, and the Ethiopian Orthodox
          Tewahedo tradition.
        </p>
      </section>

      <section className="about-wrapper">
        {/* LEFT: DECISION TREE HIERARCHY */}
        <aside className="about-tree">
          {/* Mother Church */}
          <div className="tree-level">
            <div className="leader-card tree-node tree-node-1">
              <div className="leader-avatar">
                <img
                  src={eotc}
                  alt="Ethiopian Orthodox Tewahedo Church"
                />
              </div>
              <div className="leader-text">
                <h4>Ethiopian Orthodox Tewahedo Church</h4>
                <p className="leader-title">Mother Church</p>
                <p className="leader-tagline">
                  Rooted in the apostolic faith of the early Church.
                </p>
              </div>
              <div className="leader-tooltip">
                The Ethiopian Orthodox Tewahedo Church keeps the ancient
                liturgy, fasting, and sacramental life that has formed
                generations of believers for centuries.
              </div>
            </div>
          </div>

          <div className="tree-connector tree-connector--down" />

          {/* Patriarch */}
          <div className="tree-level">
            <div className="leader-card tree-node tree-node-2">
              <div className="leader-avatar">
                <img
                  src={Abune_Matthias}
                  alt="Patriarch of the Ethiopian Orthodox Church"
                />
              </div>
              <div className="leader-text">
                <h4>Patriarch of the EOTC</h4>
                <p className="leader-title">Spiritual Head</p>
                <p className="leader-tagline">
                  Shepherding the Church throughout the world.
                </p>
              </div>
              <div className="leader-tooltip">
                The Patriarch oversees the spiritual life of the Church,
                preserving doctrine and blessing the ministry of bishops and
                priests across the globe.
              </div>
            </div>
          </div>

          <div className="tree-connector tree-connector--down" />

          {/* Selassie Church */}
          <div className="tree-level">
            <div className="leader-card tree-node tree-node-3 highlight-node">
              <div className="leader-avatar">
                <img
                  src={selasssie}
                  alt="Selassie Ethiopian Orthodox Church in London"
                />
              </div>
              <div className="leader-text">
                <h4>Selassie Ethiopian Orthodox Church</h4>
                <p className="leader-title">London Parish</p>
                <p className="leader-tagline">
                  A home for worship, prayer, and community in the heart of
                  London.
                </p>
              </div>
              <div className="leader-tooltip">
                Our parish gathers people of many backgrounds to pray together,
                celebrate the Divine Liturgy, and support one another in daily
                life.
              </div>
            </div>
          </div>

          <div className="tree-connector tree-connector--down tree-connector--into-branches" />

          {/* Priests level – 5 branches */}
          <div className="tree-level priest-level">
            <div className="leader-card priest-card tree-node tree-node-4">
              <div className="leader-avatar">
                <img
                  src={prist}
                  alt="Priest 1"
                />
              </div>
              <div className="leader-text">
                <h4>Fr. Placeholder 1</h4>
                <p className="leader-title">Parish Priest</p>
                <p className="leader-tagline">
                  “Serving with joyful humility.”
                </p>
              </div>
              <div className="leader-tooltip">
                Fr. Placeholder 1 cares for the liturgical life of the parish,
                guiding the community through prayer, confession, and pastoral
                support.
              </div>
            </div>

            <div className="leader-card priest-card tree-node tree-node-5">
              <div className="leader-avatar">
                <img
                  src={prist}
                  alt="Priest 2"
                />
              </div>
              <div className="leader-text">
                <h4>Fr. Placeholder 2</h4>
                <p className="leader-title">Assistant Priest</p>
                <p className="leader-tagline">
                  “Faith in action, every day.”
                </p>
              </div>
              <div className="leader-tooltip">
                Fr. Placeholder 2 serves in youth ministry and teaching, helping
                the next generation grow in the Orthodox faith.
              </div>
            </div>

            <div className="leader-card priest-card tree-node tree-node-6">
              <div className="leader-avatar">
                <img
                  src={prist}
                  alt="Priest 3"
                />
              </div>
              <div className="leader-text">
                <h4>Fr. Placeholder 3</h4>
                <p className="leader-title">Senior Priest</p>
                <p className="leader-tagline">“Rooted in tradition.”</p>
              </div>
              <div className="leader-tooltip">
                Fr. Placeholder 3 keeps the parish grounded in the spiritual
                wisdom of the Fathers, especially through teaching and
                confession.
              </div>
            </div>

            <div className="leader-card priest-card tree-node tree-node-7">
              <div className="leader-avatar">
                <img
                  src={prist}
                  alt="Priest 4"
                />
              </div>
              <div className="leader-text">
                <h4>Fr. Placeholder 4</h4>
                <p className="leader-title">Visiting Priest</p>
                <p className="leader-tagline">
                  “Bringing comfort and encouragement.”
                </p>
              </div>
              <div className="leader-tooltip">
                Fr. Placeholder 4 offers pastoral visits, retreats, and spiritual
                talks for the community throughout the year.
              </div>
            </div>

            <div className="leader-card priest-card tree-node tree-node-8">
              <div className="leader-avatar">
                <img
                  src={prist}
                  alt="Priest 5"
                />
              </div>
              <div className="leader-text">
                <h4>Fr. Placeholder 5</h4>
                <p className="leader-title">Deacon / Assistant</p>
                <p className="leader-tagline">“Serving at the altar.”</p>
              </div>
              <div className="leader-tooltip">
                Fr. Placeholder 5 supports the liturgy through chanting, reading
                Scripture, and assisting at the Holy Altar.
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT: STORY + BELIEF TEXT */}
        <section className="about-content">
          <div className="about-block">
            <h3>Our Story</h3>
            <p>
              Selassie Ethiopian Orthodox Church in London was founded to serve
              the growing Ethiopian community and all who wish to worship in the
              ancient Orthodox tradition. Over the years, the parish has become
              a spiritual home for families, students, and visitors from many
              backgrounds.
            </p>
            <p>
              Our services follow the Ethiopian Orthodox rite, with hymns,
              icons, incense, and the rich liturgical life of the Church.
            </p>

            {showMore && (
              <>
                <p>
                  From our earliest days, worship has been celebrated in Ge’ez,
                  Amharic, and English, allowing people to pray together across
                  generations and languages.
                </p>
                <p>
                  Alongside the Divine Liturgy, we gather for teaching,
                  spiritual counselling, children’s catechism, and community
                  meals. Many have found in this parish not only a church, but a
                  family far from home.
                </p>
              </>
            )}

            <button
              type="button"
              className="about-readmore-btn"
              onClick={() => setShowMore((prev) => !prev)}
            >
              {showMore ? "Read less ▲" : "Read more ▼"}
            </button>
          </div>

          <div className="about-block">
            <h3>What We Believe</h3>
            <p>
              We uphold the faith of the one holy, universal, and apostolic
              Church as handed down through the Apostles and the Fathers. Our
              worship is centred on the Divine Liturgy, the sacraments, and
              daily prayer.
            </p>
            <p>
              We strive to live out the Gospel through love, hospitality, and
              service to those in need. Together we pray, we learn, and we walk
              towards Christ, trusting in the mercy of the Holy Trinity.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default About;
