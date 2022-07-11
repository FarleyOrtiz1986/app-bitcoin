export interface ExchangeRates {
    success:    boolean;
    timeseries: boolean;
    start_date: Date;
    end_date:   Date;
    base:       string;
    rates:      { [key: string]: { [key: string]: number } };
}