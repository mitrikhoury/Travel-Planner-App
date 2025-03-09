export const handleSubmit = async (event) => {
  event.preventDefault();

  console.log("handleSubmit triggered!"); // Debug log

  const form = event.target;
  if (form.submitted) {
    console.warn("Prevented duplicate submission");
    return;
  }
  form.submitted = true; // Prevent multiple clicks

  const city = document.getElementById('city').value;
  const date = document.getElementById('date').value;
  const tripId = `trip-${Date.now()}`;

  try {
      const response = await fetch('http://localhost:8081/getData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city, date }),
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      createTripElement(tripId, city, data);
  } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
  } finally {
      form.submitted = false; // Reset after processing
  }
};

function createTripElement(tripId, city, data) {
  const tripsContainer = document.getElementById('trips-container');

  // Check if the trip already exists to prevent duplicates
  if (document.getElementById(tripId)) {
    console.warn(`Trip ${tripId} already exists, preventing duplication.`);
    return;
  }

  const tripSection = document.createElement('div');
  tripSection.className = 'trip-section';
  tripSection.id = tripId;
  tripSection.innerHTML = `
      <div class="trip-details">
          <h2>Trip to ${city} .</h2>
          <p>${data.country} is ${data.daysAway} days away.</p>
          <p>Weather: ${data.weather.temp}°C, ${data.weather.weather.description}</p>
          <img src="${data.image}" alt="Image of ${city}">
          <div class="trip-actions">
              <button class="btn" data-action="add-lodging" data-trip-id="${tripId}">+ Add Lodging Info</button>
              <button class="btn" data-action="add-packing" data-trip-id="${tripId}">+ Add Packing List</button>
              <button class="btn" data-action="add-notes" data-trip-id="${tripId}">+ Add Notes</button>
          </div>
          <div id="dynamic-content-${tripId}"></div>
          <div id="saved-data-${tripId}">
              <h3>Saved Information</h3>
              <ul id="saved-lodging-${tripId}"></ul>
              <ul id="saved-packing-${tripId}"></ul>
              <ul id="saved-notes-${tripId}"></ul>
          </div>
      </div>
  `;

  tripsContainer.appendChild(tripSection);


  tripSection.addEventListener('click', handleTripActions);
}

function handleTripActions(event) {
  if (!event.target.classList.contains('btn')) return;

  const action = event.target.dataset.action;
  const tripId = event.target.dataset.tripId;

  if (action === 'add-lodging') addLodgingInfo(tripId);
  if (action === 'add-packing') addPackingList(tripId);
  if (action === 'add-notes') addNotes(tripId);
}

function addLodgingInfo(tripId) {
  const dynamicContent = document.getElementById(`dynamic-content-${tripId}`);

  // Create lodging form inside the trip section
  dynamicContent.innerHTML = `
      <h3>Lodging Info</h3>
      <form id="lodging-form-${tripId}">
          <label for="hotel-${tripId}">Hotel Name:</label>
          <input type="text" id="hotel-${tripId}" required>
          <label for="check-in-${tripId}">Check-In Date:</label>
          <input type="date" id="check-in-${tripId}" required>
          <label for="check-out-${tripId}">Check-Out Date:</label>
          <input type="date" id="check-out-${tripId}" required>
          <button type="submit" class="btn">Save Lodging Info</button>
      </form>
  `;

  // Add event listener for lodging form submission
  document.getElementById(`lodging-form-${tripId}`).addEventListener('submit', (event) => {
      event.preventDefault();

      const hotel = document.getElementById(`hotel-${tripId}`).value;
      const checkIn = document.getElementById(`check-in-${tripId}`).value;
      const checkOut = document.getElementById(`check-out-${tripId}`).value;

      // Save lodging info inside the trip section
      const lodgingList = document.getElementById(`saved-lodging-${tripId}`);
      lodgingList.innerHTML += `<li><strong>${hotel}</strong>, Check-In: ${checkIn}, Check-Out: ${checkOut}</li>`;

      dynamicContent.innerHTML = ''; // Clear form after saving
  });
}

function addPackingList(tripId) {
  const dynamicContent = document.getElementById(`dynamic-content-${tripId}`);

  // Create packing list form
  dynamicContent.innerHTML = `
      <h3>Packing List</h3>
      <textarea id="packing-list-${tripId}" rows="5" placeholder="Enter your packing items .." required></textarea>
      <button class="btn" id="save-packing-${tripId}">Save Packing List</button>
  `;

  // Add event listener for saving packing list
  document.getElementById(`save-packing-${tripId}`).addEventListener('click', () => {
      const packingItems = document.getElementById(`packing-list-${tripId}`).value;

      if (packingItems.trim() === '') {
          alert('Please enter packing items.');
          return;
      }

      const packingList = document.getElementById(`saved-packing-${tripId}`);
      packingList.innerHTML += `<li>${packingItems}</li>`;

      dynamicContent.innerHTML = ''; // Clear the form after saving
  });
}

function addNotes(tripId) {
  const dynamicContent = document.getElementById(`dynamic-content-${tripId}`);

  // Create notes form
  dynamicContent.innerHTML = `
      <h3>Notes</h3>
      <textarea id="notes-${tripId}" rows="5" placeholder="Enter any note that comes to your mind." required></textarea>
      <button class="btn" id="save-notes-${tripId}">Save Notes</button>
  `;

  // Add event listener for saving notes
  document.getElementById(`save-notes-${tripId}`).addEventListener('click', () => {
      const notes = document.getElementById(`notes-${tripId}`).value;

      if (notes.trim() === '') {
          alert('Please enter some notes.');
          return;
      }

      const notesList = document.getElementById(`saved-notes-${tripId}`);
      notesList.innerHTML += `<li>${notes}</li>`;

      dynamicContent.innerHTML = ''; // Clear the form after saving
  });
}
