const deleteProd = (btn) => {
    const id = btn.parentNode.querySelector('[name=id]').value;
    const token = btn.parentNode.querySelector('[name=_csrf]').value;

    const article = btn.closest('article');

    fetch('/admin/delete-product/' + id, {
        method: 'DELETE',
        headers: {
            'csrf-token': token
        }
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            article.parentNode.removeChild(article);
        })
        .catch(err => console.log(err))
};