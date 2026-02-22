with open('HistoricalPoolPriceReportServlet.csv', 'r') as f:
    for i, line in enumerate(f):
        print(f"Line {i}: {repr(line)}")
        if i > 10:  # Just show first 10 lines
            break