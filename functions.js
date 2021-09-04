alert("hey");
var Contests = new Map()
var Handles = new Set()
// var ConType = new Set()
var ProblemRating = "1500";

function UpdateContests(){    
    fetch('https://codeforces.com/api/problemset.problems')
    .then(response => response.json())
    .then(data => {
        // console.log(ProblemRating);
        data.result.problems.forEach(problemsData => { 
            if(problemsData.rating == ProblemRating){
                var res = true;
                problemsData.tags.forEach(tag => {
                    if(tag == "interactive" || tag == "*special"){
                        res = false;
                    }
                });
                if(res)
                    Contests.set(problemsData.contestId,problemsData.index);

            }
                

        })
    
    })
}

function addHandle(){
    console.log("handle added");
    var handle = document.getElementById("handleInp").value
    if(handle == "" || Handles.has(handle)) return

    fetch("https://codeforces.com/api/user.info?handles=" + handle)
    .then(response => response.json())
    .then(data => {
        var rating = data.result[0].rating
        Handles.add(handle)

        //Add handle to Table    
        var handleTable = document.getElementById("handleTable")
        var row = handleTable.insertRow(1)

        row.insertCell(0).innerHTML = handle
        row.insertCell(1).innerHTML = rating
        row.insertCell(2).innerHTML = '<i class="trash icon" onclick="removeHandle(this)"></i>'       
    })
}

function removeHandle(btn) {
    var row = btn.parentNode.parentNode

    Handles.delete(row.cells.item(0).innerHTML)
    row.parentNode.removeChild(row)  
}

// function SC(buttonId) {
//     if (document.getElementById(buttonId).classList.contains('active')) ConType.delete(buttonId)
//     else ConType.add(buttonId)
//     document.getElementById(buttonId).classList.toggle('active')
//     document.getElementById(buttonId).blur()
// }

function Show(){
    ProblemRating = document.getElementById("ratingInp").value;
    UpdateContests();
    var AttContests = new Set()
    var fetches = []

    for(let handle of Handles){
        fetches.push(        
        fetch("https://codeforces.com/api/user.status?handle=" + handle)
        .then(response => response.json())
        .then(data => {
                        
            data.result.forEach(problems => {
                console.log(problems);
                console.log(problems.verdict);
                if (problems.verdict == "OK"){
                    var ProblemName = `${problems.problem.contestId}_${problems.problem.index}`;
                    AttContests.add(ProblemName);
                }
            })
        })
        )
    }
    
    Promise.all(fetches)
    .then(function(){
        $('#contestTable tr').not(function(){ return !!$(this).has('th').length; }).remove();
        Contests.forEach((problem_id, contest_id) => {
            flag = true
            // ConType.forEach((type) => {
            //     if(contest_name.indexOf(type) == -1) flag = false
            // })
            var ProblemIndex = `${contest_id}_${problem_id}`;
            
            if(!AttContests.has(ProblemIndex)){
            
                var contestTable = document.getElementById("contestTable")
                var row = contestTable.insertRow(-1)
                
                row.insertCell(0).innerHTML = '<a href="https://codeforces.com/problemset/problem/' + contest_id + '/' + problem_id + '" target="_blank">' + ProblemIndex + '</a>'
                // row.insertCell(1).innerHTML = contest_id + contest_name;
            }
        })
    })
}