var stepss=document.getElementById('steps')
var message=document.getElementById('message')
var sleepp=document.getElementById('sleep')

stepss.addEventListener('click', function () {
    var val = parseInt(steps.innerHTML, 10)
    console.log(val)
      if (val <= 8000) {
        message.innerHTML='GET moving!!! You are short of your goal'
        // alert('get moving')
      }
        else if(val >= 8000){
          message.innerHTML="GREAT job!!! You met your goal!"
        }
        else {
          message.innerHTML='Get moving you are short of your goal!'
        }
})

// AJAX request that to write
// http get request to ajax with route on server
// it will respond with data when
