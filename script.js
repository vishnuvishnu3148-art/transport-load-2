
    function initializeLoadShiftApp() {
      const items = [
        { name: "Vegetables", weight: 30 },
        { name: "Milk", weight: 20 },
        { name: "TV", weight: 15 },
        { name: "Fridge", weight: 55 },
        { name: "Fan", weight: 8 },
        { name: "House things", weight: 40 }
      ];

      const vehicles = [
        { name: "Pickup", capacity: 150 },
        { name: "Eicher", capacity: 100 }
      ];

      const transportRates = {
        pickup: { name: "Pickup truck", base: 250, perKm: 12, perKg: 1.5 },
        mini: { name: "Mini truck", base: 350, perKm: 15, perKg: 1.4 },
        eicher: { name: "Eicher truck", base: 600, perKm: 22, perKg: 1.2 },
        van: { name: "Cargo van", base: 300, perKm: 14, perKg: 1.7 },
        lorry: { name: "Large lorry", base: 1200, perKm: 35, perKg: 1.1 },
        container: { name: "Container truck", base: 1800, perKm: 45, perKg: 1.2 }
      };

      const publicPage = document.getElementById("publicPage");
      const loginPage = document.getElementById("loginPage");
      const detailsPage = document.getElementById("detailsPage");
      const loginForm = document.getElementById("loginForm");
      const publicCostForm = document.getElementById("publicCostForm");
      const logoutButton = document.getElementById("logoutButton");
      const costForm = document.getElementById("costForm");
      const orderForm = document.getElementById("orderForm");
      const paymentPanel = document.getElementById("paymentPanel");
      const payeeUpiId = document.getElementById("payeeUpiId");
      const upiPayButton = document.getElementById("upiPayButton");
      const itemForm = document.getElementById("itemForm");
      const vehicleForm = document.getElementById("vehicleForm");
      const assignButton = document.getElementById("assignButton");

      if (!publicPage || !loginPage || !detailsPage || !loginForm || !publicCostForm || !logoutButton || !costForm || !orderForm || !paymentPanel || !payeeUpiId || !upiPayButton || !itemForm || !vehicleForm || !assignButton) {
        return;
      }

      function openPortal() {
        publicPage.classList.add("hidden");
        loginPage.classList.remove("hidden");
        loginForm.reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      document.querySelectorAll("[data-open-portal]").forEach(function (button) {
        button.addEventListener("click", function () {
          openPortal();
        });
      });

      document.querySelectorAll("[data-show-public]").forEach(function (button) {
        button.addEventListener("click", function () {
          loginPage.classList.add("hidden");
          publicPage.classList.remove("hidden");
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      });

      document.querySelectorAll("[data-show-login]").forEach(function (button) {
        button.addEventListener("click", function () {
          openPortal();
        });
      });

      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const error = document.getElementById("loginError");

        if (!usernameInput || !passwordInput || !error) {
          return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username !== "admin" || password !== "1234") {
          error.textContent = "Invalid username or password.";
          return;
        }

        error.textContent = "";
        loginPage.classList.add("hidden");
        detailsPage.classList.remove("hidden");
        render();
        showPage("home");
      });

      function returnToLogin(portal) {
        portal.classList.add("hidden");
        loginPage.classList.remove("hidden");
        loginForm.reset();
        const loginError = document.getElementById("loginError");
        if (loginError) loginError.textContent = "";
      }

      function showPage(pageName) {
        document.querySelectorAll("[data-page-content]").forEach(function (page) {
          page.classList.toggle("hidden", page.dataset.pageContent !== pageName);
        });

        document.querySelectorAll("[data-page]").forEach(function (button) {
          if (button.dataset.page === pageName) {
            button.setAttribute("aria-current", "page");
          } else {
            button.removeAttribute("aria-current");
          }
        });

        if (window && typeof window.scrollTo === "function") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }

      document.querySelectorAll("[data-page]").forEach(function (button) {
        button.addEventListener("click", function () {
          showPage(button.dataset.page);
        });
      });

      document.querySelectorAll("[data-go-page]").forEach(function (button) {
        button.addEventListener("click", function () {
          showPage(button.dataset.goPage);
        });
      });

      logoutButton.addEventListener("click", function () {
        returnToLogin(detailsPage);
      });

      function render() {
        const itemList = document.getElementById("itemList");
        const vehicleList = document.getElementById("vehicleList");

        if (!itemList || !vehicleList) {
          return;
        }

        itemList.replaceChildren();
        vehicleList.replaceChildren();

        items.forEach(function (item) {
          const row = document.createElement("li");
          row.textContent = `${item.name} — ${item.weight} kg`;
          itemList.appendChild(row);
        });

        vehicles.forEach(function (vehicle) {
          const row = document.createElement("li");
          row.textContent = `${vehicle.name} — ${vehicle.capacity} kg capacity`;
          vehicleList.appendChild(row);
        });

        const itemCount = document.getElementById("itemCount");
        const totalWeight = document.getElementById("totalWeight");
        const totalCapacity = document.getElementById("totalCapacity");
        const vehicleCount = document.getElementById("vehicleCount");

        if (itemCount) itemCount.textContent = String(items.length);
        if (totalWeight) totalWeight.textContent = `${items.reduce((sum, item) => sum + item.weight, 0)} kg`;
        if (totalCapacity) totalCapacity.textContent = `${vehicles.reduce((sum, vehicle) => sum + vehicle.capacity, 0)} kg`;
        if (vehicleCount) vehicleCount.textContent = String(vehicles.length);
      }

      function getCostEstimate(vehicleType, weight, distance) {
        const rate = transportRates[vehicleType];
        if (!rate || !Number.isFinite(weight) || weight <= 0 ||
            !Number.isFinite(distance) || distance <= 0) {
          return null;
        }

        return {
          rate,
          total: rate.base + rate.perKm * distance + rate.perKg * weight
        };
      }

      function formatRupees(amount) {
        return `₹${amount.toLocaleString("en-IN", {
          maximumFractionDigits: 2
        })}`;
      }

      function updatePublicCostEstimate() {
        const vehicle = document.getElementById("publicCostVehicle");
        const weight = document.getElementById("publicCostWeight");
        const distance = document.getElementById("publicCostDistance");
        const amount = document.getElementById("publicEstimatedCost");
        const breakdown = document.getElementById("publicCostBreakdown");
        if (!vehicle || !weight || !distance || !amount || !breakdown) {
          return;
        }

        const estimate = getCostEstimate(vehicle.value, Number(weight.value), Number(distance.value));
        if (!estimate) {
          amount.textContent = "Enter load weight and route distance";
          breakdown.textContent = "A sample estimate will appear as you enter valid details.";
          return;
        }

        amount.textContent = formatRupees(estimate.total);
        breakdown.textContent =
          `${estimate.rate.name}: ${formatRupees(estimate.rate.base)} base + ` +
          `${formatRupees(estimate.rate.perKm)} per km + ` +
          `${formatRupees(estimate.rate.perKg)} per kg.`;
      }

      publicCostForm.addEventListener("input", updatePublicCostEstimate);
      publicCostForm.addEventListener("change", updatePublicCostEstimate);

      function updateCostEstimate(vehicleId, weightId, distanceId) {
        const vehicleElement = document.getElementById(vehicleId);
        const weightElement = document.getElementById(weightId);
        const distanceElement = document.getElementById(distanceId);
        const costElement = document.getElementById("estimatedCost");
        const breakdown = document.getElementById("costBreakdown");

        if (!vehicleElement || !weightElement || !distanceElement || !costElement || !breakdown) {
          return null;
        }

        const vehicle = vehicleElement.value;
        const weight = Number(weightElement.value);
        const distance = Number(distanceElement.value);
        const estimate = getCostEstimate(vehicle, weight, distance);

        if (!estimate) {
          costElement.textContent = "Enter a valid weight and route distance";
          breakdown.textContent =
            "Estimate uses a sample base fare, per-kilometre charge, and per-kilogram charge.";
          return null;
        }

        costElement.textContent = formatRupees(estimate.total);
        breakdown.textContent =
          `${estimate.rate.name}: ${formatRupees(estimate.rate.base)} base + ` +
          `${formatRupees(estimate.rate.perKm)} per km + ` +
          `${formatRupees(estimate.rate.perKg)} per kg.`;
        return estimate;
      }

      costForm.addEventListener("input", function () {
        updateCostEstimate("costVehicle", "costWeight", "costDistance");
      });

      let currentOrder = null;

      function buildUpiPaymentUrl() {
        if (!currentOrder) {
          return null;
        }

        const payee = payeeUpiId.value.trim();
        if (!/^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}$/.test(payee)) {
          return null;
        }

        const parameters = new URLSearchParams({
          pa: payee,
          pn: "Load Transport Agencies",
          am: currentOrder.amount.toFixed(2),
          cu: "INR",
          tn: `Transport ${currentOrder.pickup} to ${currentOrder.delivery}`
        });
        return `upi://pay?${parameters.toString()}`;
      }

      function updateUpiPaymentLink() {
        const paymentUrl = buildUpiPaymentUrl();
        upiPayButton.href = paymentUrl || "#";
        upiPayButton.setAttribute("aria-disabled", String(!paymentUrl));
        const paymentMessage = document.getElementById("paymentMessage");
        if (paymentMessage) {
          paymentMessage.textContent = "";
        }
      }

      orderForm.addEventListener("input", function () {
        if (currentOrder) {
          currentOrder = null;
          paymentPanel.classList.add("hidden");
          const orderMessage = document.getElementById("orderMessage");
          if (orderMessage) {
            orderMessage.textContent =
              "Order details changed. Submit the form again to review the updated fare.";
          }
        }
      });

      payeeUpiId.addEventListener("input", updateUpiPaymentLink);

      orderForm.addEventListener("change", function () {
        if (currentOrder) {
          currentOrder = null;
          paymentPanel.classList.add("hidden");
          const orderMessage = document.getElementById("orderMessage");
          if (orderMessage) {
            orderMessage.textContent =
              "Order details changed. Submit the form again to review the updated fare.";
          }
        }
      });

      orderForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const pickup = document.getElementById("pickupLocation");
        const delivery = document.getElementById("deliveryLocation");
        const customer = document.getElementById("customerName");
        const phone = document.getElementById("customerPhone");
        const orderVehicle = document.getElementById("orderVehicle");
        const orderWeight = document.getElementById("orderWeight");
        const orderDistance = document.getElementById("orderDistance");
        const orderMessage = document.getElementById("orderMessage");
        const paymentSummary = document.getElementById("paymentSummary");

        if (!pickup || !delivery || !customer || !phone || !orderVehicle || !orderWeight || !orderDistance || !orderMessage || !paymentSummary) {
          return;
        }

        const pickupValue = pickup.value.trim();
        const deliveryValue = delivery.value.trim();
        const customerValue = customer.value.trim();
        const phoneValue = phone.value.trim();
        const vehicleType = orderVehicle.value;
        const weight = Number(orderWeight.value);
        const distance = Number(orderDistance.value);
        const estimate = updateCostEstimate("orderVehicle", "orderWeight", "orderDistance");

        if (!pickupValue || !deliveryValue || !customerValue || !phoneValue || !estimate) {
          orderMessage.textContent = "Complete the pickup, delivery, contact, vehicle, load, and distance details.";
          paymentPanel.classList.add("hidden");
          return;
        }

        const rate = transportRates[vehicleType] || { name: "Selected vehicle" };
        currentOrder = { pickup: pickupValue, delivery: deliveryValue, amount: estimate.total };
        paymentSummary.textContent =
          `${customerValue} · ${phoneValue} | ${pickupValue} → ${deliveryValue} | ` +
          `${rate.name} | ${weight} kg | ${distance} km | Estimated fare: ${formatRupees(estimate.total)}`;
        orderMessage.textContent = "Order details saved for this session. Enter the provider's UPI ID to prepare payment.";
        paymentPanel.classList.remove("hidden");
        updateUpiPaymentLink();
      });

      upiPayButton.addEventListener("click", function (event) {
        const paymentUrl = buildUpiPaymentUrl();
        const paymentMessage = document.getElementById("paymentMessage");

        if (!paymentMessage) {
          return;
        }

        if (!paymentUrl) {
          event.preventDefault();
          paymentMessage.textContent = "Enter a valid provider UPI ID, for example provider@bank.";
          payeeUpiId.focus();
          return;
        }

        upiPayButton.href = paymentUrl;
        paymentMessage.textContent =
          "Continue in your UPI app. This demo cannot verify payment; confirm payment with your provider.";
      });

      itemForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const itemName = document.getElementById("itemName");
        const itemWeight = document.getElementById("itemWeight");
        const itemMessage = document.getElementById("itemMessage");

        if (!itemName || !itemWeight || !itemMessage) {
          return;
        }

        const name = itemName.value.trim();
        const weight = Number(itemWeight.value);

        if (!name || !Number.isFinite(weight) || weight <= 0) {
          itemMessage.textContent = "Enter an item name and a weight greater than zero.";
          return;
        }

        items.push({ name, weight });
        this.reset();
        itemMessage.textContent = "";
        render();
      });

      vehicleForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const vehicleName = document.getElementById("vehicleName");
        const vehicleCapacity = document.getElementById("vehicleCapacity");
        const vehicleMessage = document.getElementById("vehicleMessage");

        if (!vehicleName || !vehicleCapacity || !vehicleMessage) {
          return;
        }

        const name = vehicleName.value.trim();
        const capacity = Number(vehicleCapacity.value);

        if (!name || !Number.isFinite(capacity) || capacity <= 0) {
          vehicleMessage.textContent = "Enter a vehicle name and a capacity greater than zero.";
          return;
        }

        vehicles.push({ name, capacity });
        this.reset();
        vehicleMessage.textContent = "";
        render();
      });

      assignButton.addEventListener("click", function () {
        const plan = vehicles.map(function (vehicle) {
          return { vehicle, items: [], totalWeight: 0 };
        });

        const unassigned = [];

        [...items]
          .sort((a, b) => b.weight - a.weight)
          .forEach(function (item) {
            const available = plan
              .filter(entry => entry.totalWeight + item.weight <= entry.vehicle.capacity)
              .sort((a, b) =>
                (a.vehicle.capacity - a.totalWeight) -
                (b.vehicle.capacity - b.totalWeight)
              )[0];

            if (!available) {
              unassigned.push(item);
              return;
            }

            available.items.push(item);
            available.totalWeight += item.weight;
          });

        const result = document.getElementById("result");
        if (!result) {
          return;
        }

        result.replaceChildren();

        plan.forEach(function (entry) {
          const card = document.createElement("article");
          card.className = "assignment";

          const heading = document.createElement("strong");
          heading.textContent = entry.vehicle.name;
          card.appendChild(heading);

          const itemDetails = document.createElement("p");
          itemDetails.textContent =
            `Items: ${entry.items.map(item => item.name).join(", ") || "None"}`;
          card.appendChild(itemDetails);

          const weightDetails = document.createElement("p");
          weightDetails.textContent = `Load: ${entry.totalWeight} / ${entry.vehicle.capacity} kg`;
          card.appendChild(weightDetails);

          result.appendChild(card);
        });

        if (unassigned.length > 0) {
          const warning = document.createElement("article");
          warning.className = "assignment warning";

          const heading = document.createElement("strong");
          heading.textContent = "Items without available capacity";
          warning.appendChild(heading);

          const details = document.createElement("p");
          details.textContent = unassigned
            .map(item => `${item.name} (${item.weight} kg)`)
            .join(", ");
          warning.appendChild(details);

          result.appendChild(warning);
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeLoadShiftApp);
    } else {
      initializeLoadShiftApp();
    }
  