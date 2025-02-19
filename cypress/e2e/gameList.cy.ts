describe('게임 리스트 페이지', ()=>{
        beforeEach(()=>{
            cy.visit('/game')
        })
        it('게임 리스트 랜더링', ()=>{
        cy.get('[data-testid="game-card"]').should('have.length.gt', 0)  
    })

    it('게임 검색', ()=>{
        const searchTerm = '테라'
        cy.get('[data-testid="search-input"]').type(searchTerm)
        cy.get('[data-testid="game-card"]').should('contain',searchTerm)
     })

     it('무한 스크롤', ()=>{
        cy.get('[data-testid="game-card"]').its('length').then((initialCount) => {
            cy.scrollTo('bottom')
            cy.wait(3000)
            cy.get('[data-testid="game-card"]').should('have.length.gt', initialCount)
        })
     })
})