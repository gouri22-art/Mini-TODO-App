function getStats (username,data) {

    let completedTasks = data.filter((el) => el.status == true).length;
    let pendingTasks = data.filter((el) => el.status == false).length;
    let HighPriorityTasks = data.filter((el) => el.priority == "high").length;
    let MedPriorityTasks = data.filter((el) => el.priority == "medium").length;
    let lowPriorityTasks = data.filter((el) => el.priority == "low").length;

    let card = `
    <style>
      #get_stats_data{
        color:red;
        font-size: 1.2rem;
        text-align: center;
        display:flex;
        flex-direction:column;
        align-items:start;
        justify-content:center;
        padding-left:5px;
      }
      #get_stats_data>h3{
      margin-bottom:5px;
      }
    </style>
    
    <div id="get_stats_data">
       <h3> Here is Summary of the Tasks created by ${username}</h3>
       <h3> Completed Tasks: ${completedTasks}</h3>
       <h3> Pending Tasks: ${pendingTasks}</h3>
       <h3> High PriorityTasks: ${HighPriorityTasks}</h3>
       <h3>Med Priority Tasks: ${MedPriorityTasks}</h3>
       <h3> Low Priority Tasks: ${lowPriorityTasks}</h3>
    </div>`;
    addTodoDiv.style.display = "flex";
    document.getElementById("modal_content").innerHTML = card;
  }

  export {getStats}