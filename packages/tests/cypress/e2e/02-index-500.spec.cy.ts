describe("Initial failed testing", () => {
  it("failes loading index", () => {
    cy.request("/api/accounts").then((resp) => expect(resp.status).to.eq(200));
  });
});