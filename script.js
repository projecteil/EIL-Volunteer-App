//test for iterating over child elements
var langArray = [];
$('#onlinestatus option').each(function () {
	var img = $(this).attr("data-thumbnail");
	var text = this.innerText;
	var value = $(this).val();
	var item = '<li><img src="' + img + '" alt="" value="' + value + '"/><span>' + text + '</span></li>';
	langArray.push(item);
})

$('#a').html(langArray);

//Set the button value to the first el of the array
$('.btn-select').html(langArray[0]);
$('.btn-select').attr('value', 'en');

//change button stuff on click
$('#a li').click(function () {
	var img = $(this).find('img').attr("src");
	var value = $(this).find('img').attr('value');
	var text = this.innerText;
	var item = '<li><img src="' + img + '" alt="" /><span>' + text + '</span></li>';
	$('.btn-select').html(item);
	$('.btn-select').attr('value', value);
	$(".b").toggle();
	//console.log(value);
});

$(".btn-select").click(function () {
	$(".b").toggle();
});