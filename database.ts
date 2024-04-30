import { Database } from "bun:sqlite";

const db = new Database("data.sqlite", { create: true });

db.query(
  `
CREATE TABLE IF NOT EXISTS SwapEvent (
    pool TEXT,
    'block' TEXT,
    'transaction' TEXT UNIQUE PRIMARY KEY,
    sender TEXT,
    recipient TEXT,
    amount0In TEXT,
    amount1In TEXT,
    amount0Out TEXT,
    amount1Out TEXT
);

CREATE INDEX IF NOT EXISTS idx_pair ON SwapEvent(pair);
CREATE INDEX IF NOT EXISTS idx_block ON SwapEvent(block);
`
).run();

export default db;

type SwapEvent = {
  pool: string;
  block: bigint;
  transaction: string;
  sender: string;
  recipient: string;
  amount0In: bigint;
  amount1In: bigint;
  amount0Out: bigint;
  amount1Out: bigint;
};

export function store() {
  const query = db.prepare(
    `INSERT INTO SwapEvent 
        (pool, 'block', 'transaction', sender, recipient, amount0In, amount1In, amount0Out, amount1Out)
    VALUES 
        ($pool, $block, $transaction, $sender, $recipient, $amount0In, $amount1In, $amount0Out, $amount1Out)`
  );

  return db.transaction((events: SwapEvent[]) => {
    for (const event of events) {
      query.run({
        $pool: event.pool,
        $block: event.block.toString(),
        $transaction: event.transaction,
        $sender: event.sender,
        $recipient: event.recipient,
        $amount0In: event.amount0In.toString(),
        $amount1In: event.amount1In.toString(),
        $amount0Out: event.amount0Out.toString(),
        $amount1Out: event.amount1Out.toString(),
      });
    }
  });
}

export function getVolume(pool: string, limit: number) {
  const query = db.query(`
    SELECT
        SUM(sub.amount0In + sub.amount0Out) as totalVolume0,
        SUM(sub.amount1In + sub.amount1Out) as totalVolume1
    FROM (
        SELECT amount0In, amount1In, amount0Out, amount1Out
        FROM SwapEvent
        WHERE pool = $pool
        ORDER BY block DESC
        LIMIT $limit
    ) sub;`);

    type Response = {
        totalVolume0: string
        totalVolume1: string
    }
    const volume = query.get({$pool: pool, $limit: limit}) as Response

    return {
        totalVolume0: BigInt(volume.totalVolume0),
        totalVolume1: BigInt(volume.totalVolume1)
    }
}


// export function getVolume(pool: string, limit: number) {
//     const query = db.query(`
//       SELECT amount0In, amount1In, amount0Out, amount1Out
//       FROM SwapEvent
//       WHERE pool = $pool
//       ORDER BY block DESC
//       LIMIT $limit
//       `);
  
//     type Response = {
//       amount0In: string;
//       amount1In: string;
//       amount0Out: string;
//       amount1Out: string;
//     };
  
//     const events = query.all({ $pool: pool, $limit: limit }) as Response[];
//     const total = [0n, 0n];
//     console.log(events)
//     for(const event of events) {
//       total[0] += BigInt(event.amount0In) + BigInt(event.amount0Out);
//       total[1] += BigInt(event.amount1In) + BigInt(event.amount1Out);
//     }
//     return total
//   }
  