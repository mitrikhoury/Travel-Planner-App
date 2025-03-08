export const handleSubmit = async (event) => {
    event.preventDefault();
  
    const city = document.getElementById('city').value;
    const date = document.getElementById('date').value;
  
    // Generate a unique trip ID using timestamp
    const tripId = `trip-${Date.now()}`;
  
    try {
      const response = await fetch('http://localhost:8081/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, date }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
  
      const data = await response.json();
  
      // Create a new trip section
      const tripsContainer = document.getElementById('trips-container');
      const tripSection = document.createElement('div');
      tripSection.className = 'trip-section';
      tripSection.id = tripId;
      tripSection.innerHTML = `
        <div class="trip-details">
          <h2>Trip to ${city}</h2>
          <p>${data.country} is ${data.daysAway} days away.</p>
          <p>Weather: ${data.weather.temp}°C, ${data.weather.weather.description}</p>
          <img src="${data.image}" alt="Image of ${city}">
          <div class="trip-actions">
            <button class="btn" id="add-lodging-${tripId}">+ Add Lodging Info</button>
            <button class="btn" id="add-packing-${tripId}">+ Add Packing List</button>
            <button class="btn" id="add-notes-${tripId}">+ Add Notes</button>
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
  
      // Add event listeners for each trip's buttons
      document.getElementById(`add-lodging-${tripId}`).addEventListener('click', () => addLodgingInfo(tripId));
      document.getElementById(`add-packing-${tripId}`).addEventListener('click', () => addPackingList(tripId));
      document.getElementById(`add-notes-${tripId}`).addEventListener('click', () => addNotes(tripId));
  
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };
  
  // Function to handle adding lodging info for a specific trip
  const addLodgingInfo = (tripId) => {
    const dynamicContent = document.getElementById(`dynamic-content-${tripId}`);
    dynamicContent.innerHTML = `
      <h3>Lodging Info</h3>
      <form id="lodging-form-${tripId}">
        <label for="hotel">Hotel Name:</label>
        <input type="text" id="hotel-${tripId}" required>
        <label for="check-in">Check-In Date:</label>
        <input type="date" id="check-in-${tripId}" required>
        <label for="check-out">Check-Out Date:</label>
        <input type="date" id="check-out-${tripId}" required>
        <button type="submit" class="btn">Save Lodging Info</button>
      </form>
    `;
  
    document.getElementById(`lodging-form-${tripId}`).addEventListener('submit', (event) => {
      event.preventDefault();
      const hotel = document.getElementById(`hotel-${tripId}`).value;
      const checkIn = document.getElementById(`check-in-${tripId}`).value;
      const checkOut = document.getElementById(`check-out-${tripId}`).value;
  
      const lodgingList = document.getElementById(`saved-lodging-${tripId}`);
      lodgingList.innerHTML += `<li>Hotel: ${hotel}, Check-In: ${checkIn}, Check-Out: ${checkOut}</li>`;
      dynamicContent.innerHTML = ''; // Clear the form after saving
    });
  };
  
  // Function to handle adding packing list for a specific trip
  const addPackingList = (tripId) => {
    const dynamicContent = document.getElementById(`dynamic-content-${tripId}`);
    dynamicContent.innerHTML = `
      <h3>Packing List</h3>
      <textarea id="packing-list-${tripId}" rows="5" placeholder="Enter your packing items here..." required></textarea>
      <button class="btn" id="save-packing-${tripId}">Save Packing List</button>
    `;
  
    document.getElementById(`save-packing-${tripId}`).addEventListener('click', () => {
      const packingItems = document.getElementById(`packing-list-${tripId}`).value;
      const packingList = document.getElementById(`saved-packing-${tripId}`);
      packingList.innerHTML += `<li>${packingItems}</li>`;
      dynamicContent.innerHTML = ''; // Clear the form after saving
    });
  };
  
  // Function to handle adding notes for a specific trip
  const addNotes = (tripId) => {
    const dynamicContent = document.getElementById(`dynamic-content-${tripId}`);
    dynamicContent.innerHTML = `
      <h3>Notes</h3>
      <textarea id="notes-${tripId}" rows="5" placeholder="Enter your notes here..." required></textarea>
      <button class="btn" id="save-notes-${tripId}">Save Notes</button>
    `;
  
    document.getElementById(`save-notes-${tripId}`).addEventListener('click', () => {
      const notes = document.getElementById(`notes-${tripId}`).value;
      const notesList = document.getElementById(`saved-notes-${tripId}`);
      notesList.innerHTML += `<li>${notes}</li>`;
      dynamicContent.innerHTML = ''; // Clear the form after saving
    });
  };
  