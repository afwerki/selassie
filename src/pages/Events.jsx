function Events() {
  return (
    <main className="page" id="events">
      <section className="section-header">
        <h2>Church Calendar &amp; Events</h2>
        <p>
          Here you can find upcoming feast days, special services, and community
          activities at Selassie Church.
        </p>
      </section>

      <section className="event-list">
        <article className="card event-card">
          <div className="event-date">
            <span className="event-day">14</span>
            <span className="event-month">DEC</span>
          </div>
          <div className="event-content">
            <h3>Christmas Vigil &amp; Liturgy</h3>
            <p className="card-meta">From 10:00 PM · Church Sanctuary</p>
            <p>
              All-night vigil with hymns, readings, and the celebration of the
              Divine Liturgy at dawn.
            </p>
          </div>
        </article>

        <article className="card event-card">
          <div className="event-date">
            <span className="event-day">05</span>
            <span className="event-month">JAN</span>
          </div>
          <div className="event-content">
            <h3>Youth Fellowship Evening</h3>
            <p className="card-meta">6:30 PM · Community Hall</p>
            <p>
              Teaching, worship, and discussion for young people in our parish.
            </p>
          </div>
        </article>

        <article className="card event-card">
          <div className="event-date">
            <span className="event-day">19</span>
            <span className="event-month">JAN</span>
          </div>
          <div className="event-content">
            <h3>Charity Food Drive</h3>
            <p className="card-meta">After Sunday Liturgy</p>
            <p>
              Collecting food and essentials for vulnerable families in our
              local community.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

export default Events;
