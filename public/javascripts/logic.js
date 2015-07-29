
var stepss=document.getElementById('steps')
var message=document.getElementById('message')

stepss.addEventListener('click', function () {
    var val= parseInt(steps.innerHTML, 10)
    console.log(val)
    if (val < 10000) {
      message.innerHTML='GET moving!!! You are short of your goal'
      // alert('get moving')
    }
    else {
      message.innerHTML="GREAT job!!! You met your goal!"
    }

})

// AJAX request that to write
// http get request to ajax with route on server
// it will respond with data when
