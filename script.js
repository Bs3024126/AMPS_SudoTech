document.addEventListener("DOMContentLoaded", function () {
  // Sidebar toggle
  const toggleIcon = document.querySelector('header #dropdown');
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('.main');

  if (toggleIcon && sidebar && main) {
    toggleIcon.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      main.classList.toggle('shifted');
    });
  }

  // Sidebar menu active state and page switching
  const sidebarItems = document.querySelectorAll('.sidebar li[data-page]');
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const pageId = item.getAttribute('data-page');
      if (pageId) showPage(pageId);
    });
  });

  function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
      page.classList.toggle('active-page', page.id === pageId);
    });
  }

  // Dropdown toggles (Reusable function)
  function setupDropdown(toggleId, menuId) {
    const toggleBtn = document.getElementById(toggleId);
    const dropdownMenu = document.getElementById(menuId);

    if (toggleBtn && dropdownMenu) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.classList.toggle('hidden');
      });

      // Close dropdown on outside click
      document.addEventListener('click', function (e) {
        if (!toggleBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownMenu.classList.add('hidden');
        }
      });
    }
  }

  setupDropdown('dropdownToggle', 'dropdownMenu');
  setupDropdown('userManagementToggle', 'userDropdown');
  setupDropdown('ServiceToggle', 'serviceDropdown');
  setupDropdown('clientToggle', 'clientDropdown');
  setupDropdown('hmsToggle', 'hmsDropdown');

  // Chart: Audience Line Chart
  const audienceCanvas = document.getElementById("audienceChart");
  if (audienceCanvas && audienceCanvas.getContext) {
    new Chart(audienceCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Audience",
          data: [30, 25, 40, 35, 50, 45, 60, 55, 50, 70, 60, 75],
          borderColor: "#00c853",
          backgroundColor: "rgba(0, 200, 83, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#00c853"
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: val => `$${val}`
            }
          }
        }
      }
    });
  }

  // Chart: Visitors Bar Chart
  const visitorCanvas = document.getElementById("visitorsChart");
  if (visitorCanvas && visitorCanvas.getContext) {
    new Chart(visitorCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        datasets: [{
          data: [150, 230, 260, 400, 340, 350, 280],
          backgroundColor: "#81c784",
          borderRadius: 6
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Add Service Form Toggle
  const toggleFormBtn = document.getElementById('toggleFormBtn');
  const serviceForm = document.getElementById('serviceForm');

  if (toggleFormBtn && serviceForm) {
    toggleFormBtn.addEventListener('click', () => {
      const isHidden = serviceForm.classList.contains('hidden');
      serviceForm.classList.toggle('hidden', !isHidden);
      toggleFormBtn.textContent = isHidden ? '✖ Close Form' : '➕ Add New Service';
    });
  }

  // Add Service Form Submission
  const addServiceForm = document.getElementById('addServiceForm');
  const serviceTableBody = document.getElementById('serviceTableBody');
  if (addServiceForm && serviceTableBody) {
    addServiceForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const code = document.getElementById('serviceCode').value.trim();
      const name = document.getElementById('serviceName').value.trim();
      const price = document.getElementById('servicePrice').value.trim();
      const duration = document.getElementById('serviceDuration').value.trim();
      const availability = document.getElementById('serviceAvailability').value;

      if (!code || !name || !price || !duration || !availability) {
        alert('Please fill all fields');
        return;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${code}</td>
        <td>${name}</td>
        <td>${price}</td>
        <td>${duration}</td>
        <td>${availability}</td>
      `;
      serviceTableBody.appendChild(tr);

      alert(`Service Added!\nCode: ${code}\nName: ${name}\nPrice: ₹${price}\nDuration: ${duration}\nAvailability: ${availability}`);

      addServiceForm.reset();
      serviceForm.classList.add('hidden');
      toggleFormBtn.textContent = '➕ Add New Service';
    });
  }

  // Search Filter
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('input', () => {
      const filter = searchBox.value.toLowerCase();
      const rows = serviceTableBody.getElementsByTagName('tr');
      let hasMatch = false;

      Array.from(rows).forEach(row => {
        const text = row.innerText.toLowerCase();
        if (text.includes(filter)) {
          row.style.display = '';
          hasMatch = true;
        } else {
          row.style.display = 'none';
        }
      });

      // No result row
      let noResultsRow = document.getElementById('noResultsRow');
      if (!hasMatch) {
        if (!noResultsRow) {
          noResultsRow = document.createElement('tr');
          noResultsRow.id = 'noResultsRow';
          noResultsRow.innerHTML = `<td colspan="5" style="text-align:center;">No matching services found.</td>`;
          serviceTableBody.appendChild(noResultsRow);
        }
      } else if (noResultsRow) {
        noResultsRow.remove();
      }
    });
  }

  // Open/Close Overlay (Form)
  const openFormBtn = document.getElementById("openFormBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const overlay = document.getElementById("overlay");

  if (openFormBtn && closeFormBtn && overlay) {
    openFormBtn.addEventListener("click", function (e) {
      e.preventDefault();
      overlay.style.display = "flex";
    });

    closeFormBtn.addEventListener("click", function () {
      overlay.style.display = "none";
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        overlay.style.display = "none";
      }
    });
  }

});

// Modal Functions (Global Scope)
function openModal(event, name, code, email, phone) {
  event.preventDefault();

  document.getElementById('clientName').value = name;
  document.getElementById('clientCode').value = code;
  document.getElementById('clientEmail').value = email;
  document.getElementById('clientPhone').value = phone;

  const link = event.currentTarget;
  const address = link.getAttribute('data-address');
  const company = link.getAttribute('data-company');

  document.getElementById('clientAddress').value = address;
  document.getElementById('clientCompany').value = company;

  document.getElementById('clientModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('clientModal').style.display = 'none';
}



// ------------  -----------//
 // Get select all checkbox
  const selectAll = document.getElementById('selectAll');
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');

  // On Select All click
  selectAll.addEventListener('change', function() {
    rowCheckboxes.forEach(function(checkbox) {
      checkbox.checked = selectAll.checked;
    });
  });

  // On individual checkbox click
  rowCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      // If any one is unchecked, uncheck selectAll
      if (!checkbox.checked) {
        selectAll.checked = false;
      } else {
        // If all are checked, tick selectAll
        const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
        selectAll.checked = allChecked;
      }
    });
  });
  function openClientModal(name, code, email, phone, address, companyName) {
  document.getElementById('clientModal').style.display = 'block';

  document.getElementById('clientName').value = name;
  document.getElementById('clientCode').value = code;
  document.getElementById('clientEmail').value = email;
  document.getElementById('clientPhone').value = phone;
  document.getElementById('clientAddress').value = address;
  document.getElementById('clientCompany').value = companyName; // Very important: Company name set here
}

function closeClientModal() {
  document.getElementById('clientModal').style.display = 'none';
}


  function openSocietyModal(name, location, flats, president, contact, service, amc) {
  document.getElementById('societytModal').style.display = 'block';

  document.getElementById('societyName').value = name;
  document.getElementById('location').value = location;

  document.getElementById('numberOfFlats').value = flats;
  document.getElementById('presidentName').value = president;
  document.getElementById('contactNumber').value = contact;
  document.getElementById('securityService').value = service; // Very important: Company name set here
  document.getElementById('amc').value = amc; // Very important: Company name set here
}

function closeSocietyModal() {
  document.getElementById('societytModal').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', function() {
  const hmsToggle = document.getElementById('hmsToggle'); // This is the clickable anchor
  const hmsDropdown = document.getElementById('hmsDropdown'); // This is your ul hidden list

  hmsToggle.addEventListener('click', function(e) {
    e.preventDefault(); // Prevent page jump
    hmsDropdown.classList.toggle('hidden'); // Toggle the 'hidden' class to show/hide the list
  });
});