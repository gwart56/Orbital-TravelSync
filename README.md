Milestone I Submission

**Team Name:**

TravelSync

**Proposed Level of Achievement:**

Apollo 11

**Problem Motivation**

While planning our own holiday to Japan, we found it challenging to coordinate destinations and accommodations, especially while researching everything simultaneously. With numerous tabs open and scattered information, it quickly became overwhelming and difficult to track which hotels were located near which attractions. This experience inspired us to create a single, streamlined platform where all options can be organised in one place, making it easier for everyone to stay on the same page when planning a trip together.

**Project Scope**

TravelSync will be a platform designed to help travellers visualise and organise their holiday plans in a clear, timeline-based format. It will allow users to explore and compare various options, such as hotels and nearby activities, before making a final selection. Key details like price, location, and amenities are displayed at a glance, making it easy to review and decide on the best choices all in one place.

TravelSync will also support collaborative planning whereby users on the same trip can suggest hotels to stay or activities to do all on the same platform which will allow all planners to be on the same page.

Ultimately, we want TravelSync to make information gathering and sharing, especially when there are multiple people involved, to be more streamlined and efficient so that the process of planning a trip does not become such a hassle.

**User Stories**

1. As a group of friends who want to travel together, we want to be able to share a collaborative itinerary so that we can be on the same page when planning and also be able to enjoy the planning process.  

2. As a group of travellers who want to keep track of finances on a trip, I want to be able to add expenses to a list of expenses and then have the total cost calculated and split among individuals at the end of the trip.

3. As a traveler who wants to easily compare different prices of hotels without having to check between multiple tabs, I want to be able to view all hotel options from various booking websites in one place, with price comparisons and location details, so I can make an informed decision quickly and efficiently.

4. As a traveler planning a trip who wants to find accommodation in the most convenient location, I want to be able to input multiple destinations into a map and see a visual representation of nearby hotels, allowing me to easily compare their locations and make the best choice.

**Features**

1. Hotel Booking (core): allows for easy comparisons of prices of hotels and its location between hotels of different websites.  

2. Itinerary Planner (core): For each day of the trip, users can input certain activities, and a hotel they stay in for that night (except the day they fly off).  

3. Collaborative Itinerary (core): allows users to create a group which multiple parties can access. There is a master planner who decides which hotels/activities to choose. However, other people can add suggestions for the master planner to see and compare. This allows for cleaner collaboration between multiple parties.  

4. Map Display (core): there’ll be a map which marks the location of each suggested hotel to allow users to have visual representation of where each possible hotel is located for easier comparison.

5. Travel Time (extension): be able to display the expected time taken to travel from location 1 to location 2, so that it is easier to plan what time to depart from location 1\.  

6. Expense Splitting (extension): allows users to select which person pays for which items, or to just even split the bill.  

7. Finance Manager (extension): tracks the various expenses incurred each day and throughout the trip, and also allows for foreign currency exchange.

**Design and Plan**

- **Itinerary Creation**: Users can create personalized travel itineraries. Each itinerary supports multiple days, and each day can include a range of planned activities.

- **Activity and Booking Management**: For each day, users can add both confirmed and tentative (unconfirmed) activities, as well as hotel bookings.

- **Day View Interface**: By selecting a specific day, users can view a detailed overview that includes all scheduled activities and hotel arrangements—whether confirmed or pending.

**Timeline**

1. Milestone 1 \- Technical proof of concept (i.e., a minimal working system with both the frontend and the backend integrated for a very simple feature) (2 June)
   1. Make a basic frontend
   2. Implement the itinerary planner functionalities (allow users to choose the number of days of trip, adding activities to each day).  

2. Milestone 2 \- Prototype (i.e., a working system with the core features) (30 June)
   1. Set up the database, and authentication system.
   2. Implement the collaborative features (others can put in suggestions of hotels/activities for the master planner to compare and choose).
   3. Implement Hotel Booking features (price comparison and location retrieval from multiple hotel websites).
   4. Implement basic prototype of Map Display. (just have a map displayed)  

3. Milestone 3 \- Extended system (i.e., a working system with both the core \+ extension features) (28 July)
   1. Fully implement the Map Display. (have the map display multiple points of locations on the same map for easy comparison)
   2. Implement the Finance Manager.
   3. Implement expense splitting feature in the finance manager.
   4. Implement the travel time feature integrated with the itinerary planner.

**Prototype Overview**  
The current prototype of the TravelSync, below are the instructions for running the prototype locally, as well as the technologies used in its development.

**Deploying Project Prototype**  
To set up and run the website locally, follow these steps:

1. Install Node.js: Ensure Node.js is installed on your system (download from https://nodejs.org/).
2. Use this to access the project files: [https://github.com/gwart56/Orbital-TravelSync.git](https://github.com/gwart56/Orbital-TravelSync.git)
3. Open the terminal in the project folder (‘react-js-test’).
4. Execute the command: npm run dev.
5. Access the Website: Click on the generated localhost link to launch the website in your browser.

**Tech Stack**  
The application is built using the following technologies:

HTML: Used for structuring the website’s content and layout.

CSS: Handles styling and visual enhancements.

JavaScript & React: Implemented to ensure dynamic and responsive user interactions. React is a JavaScript library used to implement component-based UI

This combination of technologies ensures an efficient, user-friendly interface with seamless functionality.

[image1]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAe8AAAAZCAYAAAAYNaZ9AAACEklEQVR4Xu3ZTUtUYRgG4PkD/YCWGRISBgUFFUkGSYZRi1kHURRt2kSDEUIU4SZaRBEtIoto08e0zRahEdI/KMiYlZOB6ECDguYbc6TDmTMuMvLjxeuCGx8f35k5nsXcMFMIf+HV5wkREVnDXL59L7S1tYWFhYX8W/KmVyqVQrlcDjMzM/+cqampUCwWw903wy33fqX59OVbqFQqYXp6OszPz+cvd1UU8ovl5C9URERWN3eGnof+/v6wuLiYf0ve9P5XeRcKhXD6ykDLvV9pNmx5Q8y2XPqVhLXn3sPqUN7AhlGbXSr8n3P5vwBZyptobGvvaErDRLWazO0dneHt8LvcI5Ye0zAy+iGd34+MpnP2zMD1G2H7jp0t+6vXBsKBru6mXX7O7ur1ejJ37t4bbt4aTOahp8/S842fL16+TuZq9Xvye+Oj0eWe+/6Dh6Hn+Il0n/XnTON/7+07le7PnLsQenr7ms6sRG/fyTA5+aNpV6vVmq4/+1Fu/jVmZ+fS3a49+8LZ8xeTufHd7cGuI9mjqe6jx8LX8fFkfvT4SdNz7j90OP3eN7v/ODbW8tqwWShvWAdbB4vrFiB+yhsAIqO8ASAyyhsAIqO8ASAyyhsAIqO8ASAyyhsAIqO8ASAyyhsAIqO8ASAyyhsAIqO8ASAyyhsAIqO8ASAyyhsAIqO8ASAyyhsAIqO8ASAyyhsAIvMbtPouMZJ4gRAAAAAASUVORK5CYII=
