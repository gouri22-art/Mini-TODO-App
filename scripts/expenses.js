document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modal = document.getElementById("expense-modal");
    const expenseForm = document.getElementById("expense-form");
    const totalExpenses = document.getElementById("total-expenses");

    // Open Modal
    openModalBtn.addEventListener("click", function () {
        modal.style.display = "block"; // Show the modal
    });

    // Close Modal
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none"; // Hide the modal
    });

    // Close Modal if user clicks outside of the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none"; // Hide modal if clicked outside
        }
    });

    // Handle form submission (add expense)
    expenseForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const expenseName = document.getElementById("expense-name").value;
        const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
        const expenseCategory = document.getElementById("expense-category").value;

        if (expenseName && expenseAmount && expenseCategory) {
            const expense = {
                name: expenseName,
                amount: expenseAmount,
                category: expenseCategory
            };

            try {
                const response = await fetch("https://beryl-ember-havarti.glitch.me/expenses", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(expense),
                });

                if (response.ok) {
                    alert("Expense added successfully!");
                    modal.style.display = "none"; // Close the modal
                    expenseForm.reset(); // Reset form fields
                    fetchExpenses(); // Refresh the list of expenses
                } else {
                    alert("Failed to add expense.");
                }
            } catch (error) {
                console.error("Error adding expense:", error);
                alert("An error occurred. Please try again.");
            }
        }
    });

    // Fetch and display existing expenses
    async function fetchExpenses() {
        const response = await fetch("https://beryl-ember-havarti.glitch.me/expenses");
        const expenses = await response.json();
        const expensesTable = document.getElementById("expenses-table");

        expensesTable.innerHTML = ""; // Clear the table before adding new rows

        let totalAmount = 0; // Variable to store total expenses

        expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
            `;
            expensesTable.appendChild(row);

            // Add expense amount to totalAmount
            totalAmount += expense.amount;
        });

        // Update the total expenses displayed
        totalExpenses.textContent = totalAmount.toFixed(2);
    }

    // Initialize expenses on page load
    fetchExpenses();
});
