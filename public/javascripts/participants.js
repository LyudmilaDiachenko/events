const ctx = document.getElementById('chart')
const grouped = JSON.parse(ctx.dataset.participants)
    .reduce(
        (acc, el) => {
            acc[el.registered] = ++acc[el.registered] || 1
            return acc
        }, 
        {}
    )
const data = Object.keys(grouped).map(key => {
    return {x: key, y: grouped[key]};
}).sort((a, b) => a.x.split('.').reverse().join('') > b.x.split('.').reverse().join('') ? 1 : -1)

console.log(grouped)
new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [{
        label: ' # per day',
        data
    }]
  }
});