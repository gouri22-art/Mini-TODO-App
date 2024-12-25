document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem('loginData')); // Retrieve logged-in user from localStorage

    if (!currentUser) {
        alert("You need to log in first.");
        window.location.href = "index.html"; // Redirect to login page if not logged in
        return;
    }

    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modal = document.getElementById("expense-modal");
    const expenseForm = document.getElementById("expense-form");
    const totalExpenses = document.getElementById("total-expenses");
    const expensesTable = document.getElementById("expenses-table");
    const logoutBtn = document.getElementById("logout");

    // Open Modal to Add Expense
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

    // Handle form submission to add expense
    expenseForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const expenseName = document.getElementById("expense-name").value;
        const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
        const expenseCategory = document.getElementById("expense-category").value;

        if (expenseName && expenseAmount && expenseCategory) {
            const expense = {
                userId: currentUser.id, // Store the userId with the expense
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
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Fetch and display existing expenses (only for the current user)
    async function fetchExpenses() {
        try {
            const response = await fetch(`https://beryl-ember-havarti.glitch.me/expenses?userId=${currentUser.id}`);
            const expenses = await response.json();
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

                totalAmount += expense.amount;
            });

            totalExpenses.textContent = totalAmount.toFixed(2);

            // Add event listeners to delete buttons after the expenses are loaded
            const deleteButtons = document.querySelectorAll(".delete-btn");
            deleteButtons.forEach(button => {
                button.addEventListener("click", async function () {
                    const expenseId = button.getAttribute("data-id");
                    await deleteExpense(expenseId); // Call the delete function
                });
            });
        } catch (error) {
            console.error("Error fetching expenses:", error);
            alert("Failed to load expenses. Please try again.");
        }
    }

    // Delete expense function
    async function deleteExpense(expenseId) {
        try {
            const response = await fetch(`https://beryl-ember-havarti.glitch.me/expenses/${expenseId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Expense deleted successfully!");
                fetchExpenses(); // Refresh the list of expenses after deletion
            } else {
                alert("Failed to delete expense.");
            }
        } catch (error) {
            console.error("Error deleting expense:", error);
            alert("An error occurred while deleting the expense. Please try again.");
        }
    }

    // Logout functionality
    logoutBtn.addEventListener("click", function () {
        alert("Logging out...");
        logout(); // Call the logout function to clear session and redirect
    });

    // Logout function
    function logout() {
        localStorage.removeItem('loginData'); // Remove userId from localStorage
        alert("You have been logged out.");
        window.location.href = "index.html"; // Redirect to home or login page
    }

    // Initialize expenses on page load
    fetchExpenses();
});
