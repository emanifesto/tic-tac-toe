
async function main(){
    const squaresPromise = new Promise<NodeListOf<Element>>((resolve) => {
        setTimeout( (): void => {
            const squares:NodeListOf<Element> = document.querySelectorAll('.square')
            resolve(squares)
        }, 1000)
    })

    const squares: NodeListOf<Element> = await squaresPromise

    const eventCodeToId = new Map([["Numpad7", 0], ["Numpad8", 1], ["Numpad9", 2], ["Numpad4", 3],
        ["Numpad5", 4], ["Numpad6", 5], ["Numpad1", 6], ["Numpad2", 7], ["Numpad3", 8]
    ])

    document.addEventListener('keydown', (event) => {
        if (event.code.startsWith('Numpad')){
            const player:string | undefined = document.querySelector('section>section>strong')?.innerHTML
            const id:number | undefined = eventCodeToId.get(event.code)

            if (typeof id === 'number' && typeof player === "string"){
                const square = squares[id]
                if (!square.innerHTML)
                    square.innerHTML = player
            }
        }
    })
}

main()