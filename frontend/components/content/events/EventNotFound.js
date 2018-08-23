import React from 'react';

import NotFoundSection from '../../NotFoundSection';

const EventNotFound = () => (
  <NotFoundSection
    title="Event not found"
    content="Uh-oh! Looks like the event you were looking for was either removed or does not exist."
    url="/events"
    urlText="Back to all events"
  />
);

export default EventNotFound;
