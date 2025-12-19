
async function main(){

    const selectorPromise = new Promise<NodeListOf<Element> | string>((resolve, reject) => {
        setTimeout( (): void => {
            const squares:NodeListOf<Element> = document.querySelectorAll('.square')
            if (squares)
                resolve(squares)
            reject('Err')
        }, 1000)
    })

    const squares: NodeListOf<Element> | string = await selectorPromise
    console.log(squares)
}

main()