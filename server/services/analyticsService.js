/**
 * Service d'analyse des transactions financières
 */
class AnalyticsService {
  /**
   * Analyse les transactions et les groupe par catégorie
   * @param {Array} transactions - Liste des transactions
   * @returns {Object} Analyse des dépenses par catégorie
   */
  analyzeByCategory(transactions) {
    const categoryMap = {};
    let totalExpenses = 0;
    let totalIncome = 0;

    transactions.forEach(transaction => {
      const amount = transaction.amount;
      const category = transaction.category_name || 'Non catégorisé';

      if (amount < 0) {
        // Dépense (montant négatif)
        const absAmount = Math.abs(amount);
        totalExpenses += absAmount;

        if (!categoryMap[category]) {
          categoryMap[category] = {
            total: 0,
            count: 0,
            transactions: []
          };
        }

        categoryMap[category].total += absAmount;
        categoryMap[category].count += 1;
        categoryMap[category].transactions.push(transaction);
      } else {
        // Revenu (montant positif)
        totalIncome += amount;
      }
    });

    // Convertir en tableau et trier par montant décroissant
    const categories = Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
        percentage: totalExpenses > 0 
          ? ((data.total / totalExpenses) * 100).toFixed(1) 
          : '0.0'
      }))
      .sort((a, b) => b.total - a.total);

    return {
      categories,
      summary: {
        totalExpenses: totalExpenses.toFixed(2),
        totalIncome: totalIncome.toFixed(2),
        balance: (totalIncome - totalExpenses).toFixed(2),
        transactionCount: transactions.length
      }
    };
  }
}

module.exports = new AnalyticsService();
