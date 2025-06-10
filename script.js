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

  // Topbar dropdown
  const toggleBtn = document.getElementById('dropdownToggle');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (toggleBtn && dropdownMenu) {
    toggleBtn.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
    });

    dropdownMenu.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        toggleBtn.innerHTML = `<i class="fa fa-calendar"></i> ${item.textContent} <i class="fa fa-chevron-down"></i>`;
        dropdownMenu.classList.add('hidden');
      });
    });
  }

  // User Management Dropdown
  const userDropdownToggle = document.getElementById("userManagementToggle");
  const userDropdown = document.getElementById("userDropdown");

  if (userDropdownToggle && userDropdown) {
    userDropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      userDropdown.classList.toggle("hidden");
    });
  }

  // Service Dropdown
  const serviceToggle = document.getElementById("ServiceToggle");
  const serviceDropdown = document.getElementById("serviceDropdown");

  if (serviceToggle && serviceDropdown) {
    serviceToggle.addEventListener("click", function (e) {
      e.preventDefault();
      serviceDropdown.classList.toggle("hidden");
    });
  }
  // Client Dropdown
const clientToggle = document.getElementById("clientToggle");
const clientDropdown = document.getElementById("clientDropdown");

if (clientToggle && clientDropdown) {
  clientToggle.addEventListener("click", function (e) {
    e.preventDefault();
    clientDropdown.classList.toggle("hidden");
  });
}

 
  // Click outside to close dropdowns
  document.addEventListener("click", function (e) {
    if (!toggleBtn?.contains(e.target) && !dropdownMenu?.contains(e.target)) {
      dropdownMenu?.classList.add("hidden");
    }
    if (!userDropdownToggle?.contains(e.target) && !userDropdown?.contains(e.target)) {
      userDropdown?.classList.add("hidden");
    }
    if (!serviceToggle?.contains(e.target) && !serviceDropdown?.contains(e.target)) {
      serviceDropdown?.classList.add("hidden");
    }
  });

  // Chart: Audience Line Chart
  const audienceCanvas = document.getElementById("audienceChart");
  if (audienceCanvas && audienceCanvas.getContext) {
    const ctx = audienceCanvas.getContext("2d");
    new Chart(ctx, {
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
    const ctx = visitorCanvas.getContext("2d");
    new Chart(ctx, {
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
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  // Add Service Form Toggle
  const toggleFormBtn = document.getElementById('toggleFormBtn');
  const serviceForm = document.getElementById('serviceForm');
  const addServiceForm = document.getElementById('addServiceForm');
  const serviceTableBody = document.getElementById('serviceTableBody');
  const searchBox = document.getElementById('searchBox');

  if (toggleFormBtn && serviceForm) {
    toggleFormBtn.addEventListener('click', () => {
      const isHidden = serviceForm.classList.contains('hidden');
      serviceForm.classList.toggle('hidden', !isHidden);
      toggleFormBtn.textContent = isHidden ? '✖ Close Form' : '➕ Add New Service';
    });
  }

  // Add Service Form Submission
  if (addServiceForm) {
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


  const openFormBtn = document.getElementById("openFormBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const overlay = document.getElementById("overlay");

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




});
// Open form
document.getElementById("openFormBtn").onclick = function () {
  document.querySelector(".overlay").style.display = "flex";
};

// Close form using "Cancel" button
document.querySelector(".btn.cancel").onclick = function () {
  document.querySelector(".overlay").style.display = "none";
};

// Close form using ✖ icon
document.querySelector(".form-popup").addEventListener("click", function (e) {
  if (e.target.textContent === "✖") {
    document.querySelector(".overlay").style.display = "none";
  }
});
