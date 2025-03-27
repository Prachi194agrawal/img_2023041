const { Contract } = require('fabric-contract-api');

class FraudContract extends Contract {
    async InitLedger(ctx) {
        const transactions = [];
        await ctx.stub.putState('transactions', Buffer.from(JSON.stringify(transactions)));
    }


    
    async LogTransaction(ctx, transactionData) {
        const transactions = JSON.parse(await ctx.stub.getState('transactions'));
        transactions.push(JSON.parse(transactionData));
        await ctx.stub.putState('transactions', Buffer.from(JSON.stringify(transactions)));
    }
}
