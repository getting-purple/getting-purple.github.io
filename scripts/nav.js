$('.navI').click(function() {
    var mine = this.id.split('~')[1];
    $('.post').hide()
    $('#'+mine).show()
    $('#'+mine).css('transform','rotate(0deg)')
    $('#'+mine).css('position','initial')
    
    $('.navI').css('background','none')
    if (this.id.includes('button~')) {    
        $(this).css('background','darkseagreen')
    }

    
})

$('#viewAll').click(function() {
    $('.post').show()
    $('.post').css('transform','rotate(0deg)')
    $('.post').css('position','initial')
    $(this).css('background','darkseagreen')
})
$('#hideAll').click(function() {
    $('.post').hide()
    $(this).css('background','lightslategrey')
} )

$('a').attr('target', function() {
  if(this.host == location.host) return '_self'
  else return '_blank'
})

fetch('https://api.github.com/repos/getting-purple/getting-purple.github.io/commits')
    .then(response => {
	if (!response.ok) {
	    throw new Error('Network response was not ok');
	}
	return response.json(); // Assuming the API returns JSON
    })
    .then(data => {
	// Do something with the data
	$('#header').append("<em>last updated "+data[0].commit.committer.date.split("T")[0]+"</em>");
    })
    .catch(error => {
	// Handle errors
	console.error('There has been a problem with your fetch operation:', error);
    });
