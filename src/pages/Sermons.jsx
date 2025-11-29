import { useState } from "react";

const YOUTUBE_SRC = "https://www.youtube.com/embed/HZJ6CFdMD2Y";

function Sermons() {
  const [activeTab, setActiveTab] = useState("videos"); // 'videos', 'teachings', 'qa'

  return (
    <section className="sermons-section" id="sermons">
      <div className="section-header">
        <h2>Teachings &amp; Sermons</h2>
        <p>
          Grow deeper in faith through sermons, written teachings, and
          reflections from Selassie Ethiopian Orthodox Church.
        </p>
      </div>

      {/* Tabs */}
      <div className="sermons-tabs">
        <button
          type="button"
          className={`sermons-tab ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </button>
        <button
          type="button"
          className={`sermons-tab ${activeTab === "teachings" ? "active" : ""}`}
          onClick={() => setActiveTab("teachings")}
        >
          Written Teachings
        </button>
        <button
          type="button"
          className={`sermons-tab ${activeTab === "qa" ? "active" : ""}`}
          onClick={() => setActiveTab("qa")}
        >
          Q &amp; A
        </button>
      </div>

      {/* Tab panels */}
      {/* Videos */}
      {activeTab === "videos" && (
        <div className="tab-panel active">
          <div className="video-grid">
            {/* card 1 */}
            <article className="card video-card">
              <div className="video-frame">
                <div className="video-responsive">
                  <iframe
                    src={YOUTUBE_SRC}
                    title="Sermon 1"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="video-info">
                <h3>The Mystery of the Holy Trinity</h3>
                <p className="card-meta">Feast of Selassie · Teaching 1</p>
                <p>
                  A teaching on the Holy Trinity and how this mystery is
                  celebrated in the liturgy and life of the Church.
                </p>
              </div>
            </article>

            {/* card 2 */}
            <article className="card video-card">
              <div className="video-frame">
                <div className="video-responsive">
                  <iframe
                    src={YOUTUBE_SRC}
                    title="Sermon 2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="video-info">
                <h3>Faith in Times of Trial</h3>
                <p className="card-meta">Sunday Liturgy · Teaching 2</p>
                <p>
                  Reflecting on the lives of the saints and how they held fast
                  to Christ through suffering and hardship.
                </p>
              </div>
            </article>

            {/* card 3 */}
            <article className="card video-card">
              <div className="video-frame">
                <div className="video-responsive">
                  <iframe
                    src={YOUTUBE_SRC}
                    title="Sermon 3"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="video-info">
                <h3>The Gift of Repentance</h3>
                <p className="card-meta">Lenten Series · Teaching 3</p>
                <p>
                  Exploring the meaning of repentance in the Orthodox tradition
                  and how confession heals the soul.
                </p>
              </div>
            </article>

            {/* card 4 */}
            <article className="card video-card">
              <div className="video-frame">
                <div className="video-responsive">
                  <iframe
                    src={YOUTUBE_SRC}
                    title="Sermon 4"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="video-info">
                <h3>Living the Gospel Daily</h3>
                <p className="card-meta">Teaching Series · Lesson 4</p>
                <p>
                  Practical reflections on how we can live out the Gospel in our
                  families, work, and community life.
                </p>
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Written Teachings */}
      {activeTab === "teachings" && (
        <div className="tab-panel active">
          <div className="teaching-grid">
            <article className="card teaching-card">
              <span className="tag-pill">Doctrine</span>
              <h3>The Incarnation of Christ</h3>
              <p className="card-meta">Study Note · 8 min read</p>
              <p>
                How the Word of God became flesh for our salvation, and why the
                Incarnation is at the heart of our faith and worship.
              </p>
            </article>

            <article className="card teaching-card">
              <span className="tag-pill">Liturgy</span>
              <h3>Understanding the Divine Liturgy</h3>
              <p className="card-meta">Guided Walkthrough · 10 min read</p>
              <p>
                A step-by-step guide through the Divine Liturgy of the Ethiopian
                Orthodox Church with short explanations.
              </p>
            </article>

            <article className="card teaching-card">
              <span className="tag-pill">Spiritual Life</span>
              <h3>Prayer in the Orthodox Tradition</h3>
              <p className="card-meta">Reflection · 6 min read</p>
              <p>
                Simple practices to deepen our daily prayer life, rooted in the
                Psalms and the prayers of the saints.
              </p>
            </article>
          </div>
        </div>
      )}

      {/* Q & A */}
      {activeTab === "qa" && (
        <div className="tab-panel active">
          <div className="qa-grid">
            <article className="card qa-card">
              <h3>What should I expect in my first visit?</h3>
              <p>
                You are welcome to join the full Liturgy. Ushers can help you
                find a place to stand and provide an English booklet. You are
                free to observe and pray along.
              </p>
            </article>

            <article className="card qa-card">
              <h3>Can non-Ethiopians attend the services?</h3>
              <p>
                Yes. Everyone is welcome. Many of our members are from diverse
                backgrounds, and we provide explanations in English when
                possible.
              </p>
            </article>

            <article className="card qa-card">
              <h3>How can I request a prayer or speak with a priest?</h3>
              <p>
                You can speak to a priest after the service or use the contact
                form below to request a meeting or submit a prayer intention.
              </p>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}

export default Sermons;
