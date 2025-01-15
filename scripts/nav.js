$('.navI').click(function() {
    var mine = this.href;
    $('.essay').each(function() {
        console.log('this')
        if (this.id == mine) {this.show()}
        else {this.hide()} })
    console.log(this.href)
})

