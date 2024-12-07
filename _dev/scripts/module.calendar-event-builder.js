'use strict';
/**
 * Calendar Event Builder Module
 *
 * Provides functionality for creating and managing calendar event links for various platforms like Google Calendar, Outlook, Yahoo Calendar, and iCalendar.
 *
 * Methods Overview:
 * - calendar_event_builder.initialize()
 * - calendar_event_builder.populate_form()
 * - calendar_event_builder.populate_data_calendar_link()
 * - calendar_event_builder.submit_listener()
 */

storm_eagle.module('calendar_event_builder', () => {
  let self;

  /**
   * Default event details used for generating calendar links.
   */
  const invite_details = {
    start_date: '2017-05-04',
    start_time: '13:00:00',
    end_date: '2017-05-04',
    end_time: '21:00:00',
    duration: '0800',
    timezone: 'Europe/London',
    title: 'Star Wars Day Party',
    description: 'May the force be with you',
    location: 'Tatooine',
    organizer: 'Luke Skywalker',
    organizer_email: 'luke@starwars.com',
  };

  return {
    /**
     * Initializes the calendar event builder.
     * Populates the form fields, generates calendar links, and sets up the form submit listener.
     */
    initialize: () => {
      self = storm_eagle.calendar_event_builder;
      self.populate_form();
      self.populate_data_calendar_link();
      self.submit_listener();
    },

    /**
     * Populates the form fields with default event details.
     */
    populate_form: () => {
      document.querySelector('input[name=start_date]').value = invite_details.start_date;
      document.querySelector('input[name=start_time]').value = invite_details.start_time;
      document.querySelector('input[name=end_date]').value = invite_details.end_date;
      document.querySelector('input[name=end_time]').value = invite_details.end_time;
      document.querySelector('input[name=duration]').value = invite_details.duration;
      document.querySelector('input[name=timezone]').value = invite_details.timezone;
      document.querySelector('input[name=title]').value = invite_details.title;
      document.querySelector('input[name=description]').value = invite_details.description;
      document.querySelector('input[name=location]').value = invite_details.location;
      document.querySelector('input[name=organizer]').value = invite_details.organizer;
      document.querySelector('input[name=organizer_email]').value = invite_details.organizer_email;
    },

    /**
     * Generates and populates calendar event links for Google, Outlook, Yahoo, and iCalendar.
     */
    populate_data_calendar_link: () => {
      let start_date, start_time, end_date, end_time;
      let outlookOnlineURL, googleURL, yahooURL, icalendar_url;

      // Format the dates for use in the URLs
      start_date = invite_details.start_date.replaceAll('-', '');
      end_date = invite_details.end_date.replaceAll('-', '');
      start_time = invite_details.start_time.replaceAll(':', '');
      end_time = invite_details.end_time.replaceAll(':', '');

      // Generate links for different calendar services
      outlookOnlineURL = `https://outlook.live.com/owa?rru=addevent&startdt=${start_date}T${invite_details.start_time}Z&enddt=${end_date}T${invite_details.end_time}Z&subject=${encodeURIComponent(invite_details.title)}&location=${encodeURIComponent(invite_details.location)}&body=${encodeURIComponent(invite_details.description)}&allday=false&path=/calendar/view/Month`;
      document.getElementById('outlook').setAttribute('href', outlookOnlineURL);

      googleURL = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${start_date}T${start_time}Z/${end_date}T${end_time}Z&location=${encodeURIComponent(invite_details.location)}&text=${encodeURIComponent(invite_details.title)}&invite_details=${encodeURIComponent(invite_details.description)}`;
      document.getElementById('google').setAttribute('href', googleURL);

      yahooURL = `http://calendar.yahoo.com/?st=${start_date}T${start_time}Z&dur=${invite_details.duration}&view=d&v=60&type=20&title=${encodeURIComponent(invite_details.title)}&in_loc=${encodeURIComponent(invite_details.location)}&desc=${encodeURIComponent(invite_details.description)}`;
      document.getElementById('yahoo').setAttribute('href', yahooURL);

      // Generate an iCalendar format string
      icalendar_url = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:
X-PUBLISHED-TTL:P1W
BEGIN:VEVENT
UID:58dc86628ac31
DTSTART:${start_date}T${start_time}Z
SEQUENCE:0
TRANSP:OPAQUE
DTEND:${end_date}T${end_time}Z
LOCATION:${invite_details.location}
SUMMARY:${invite_details.title}
CLASS:PUBLIC
DESCRIPTION:${invite_details.description}
ORGANIZER:${invite_details.organizer}<${invite_details.organizer_email}>
DTSTAMP:${start_date}T${start_time}Z
END:VEVENT
END:VCALENDAR`;
      document.querySelector('#icalendar').innerHTML = icalendar_url;
    },

    /**
     * Adds a submit listener to the form to dynamically update the calendar links based on user input.
     */
    submit_listener: () => {
      /**
       * Updates `invite_details` with values from the form fields.
       */
      const populate_json = () => {
        invite_details.start_date = document.querySelector('input[name=start_date]').value;
        invite_details.start_time = document.querySelector('input[name=start_time]').value;
        invite_details.end_date = document.querySelector('input[name=end_date]').value;
        invite_details.end_time = document.querySelector('input[name=end_time]').value;
        invite_details.duration = document.querySelector('input[name=duration]').value;
        invite_details.timezone = document.querySelector('input[name=timezone]').value;
        invite_details.title = document.querySelector('input[name=title]').value;
        invite_details.description = document.querySelector('input[name=description]').value;
        invite_details.location = document.querySelector('input[name=location]').value;
        invite_details.organizer = document.querySelector('input[name=organizer]').value;
        invite_details.organizer_email = document.querySelector('input[name=organizer_email]').value;
      };

      // Prevent form submission and update calendar links
      document.querySelector('form[name=calendar-form]').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        populate_json();
        self.populate_data_calendar_link();
      });
    },
  };
});
