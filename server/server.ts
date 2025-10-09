import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 8080;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json())

app.get('/', (req: any, res: any) => {
    res.send('backend server works');
});

app.post('/api/problems/submit', async (req: any, res: any) => {
   const { source_code, language_id, stdin } = req.body;
   console.log(source_code, language_id, stdin)

   try {
    const body = { source_code, language_id, stdin }
    const response = await fetch(`https://${process.env.RAPIDAPI_HOST}/submissions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': process.env.RAPIDAPI_HOST,
            'x-rapidapi-key': process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify(body)
    })
     
    const data = await response.json()
    const token = data.token

    const submissionResult = await pollSubmissionStatus(token)
    console.log(submissionResult)
  
   } catch (error) {
    res.status(500).json({ error: error })
   }
   
});

async function pollSubmissionStatus(token: string) {
    const submissionUri = `https://${process.env.RAPIDAPI_HOST}/submissions/${token}`
    const maxAttempts = 10
    const pollInterval = 1000 // 1 second

    let attempts = 0
    while (attempts < maxAttempts) {
        try {
            // Now we need to periodically poll the token and check up on the status of our submission
            const response = await fetch(submissionUri, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-rapidapi-host': process.env.RAPIDAPI_HOST,
                    'x-rapidapi-key': process.env.RAPIDAPI_KEY
                },
            })
            
            // If response code is outside of 2xx range (ex: 404)
            if (!response.ok) {
                console.log(`Received ${response.status} -- trying again in ${pollInterval} ms`)
                await sleep(pollInterval)
            }
            
            // Check status.description field within the response body --> tells us whether or not code is accepted or not
            const data = await response.json()
            const status = data.status?.description
            console.log(`Current status = ${status}`)

            if (status === 'Accepted') {
                console.log('Submission has been accepted, returning response body.')
                return data
            }

            if (status === 'Wrong Answer' || status == 'Runtime Error' || status == 'Compilation Error' || status == 'Time Limit Exceeded') {
                console.log(`Submission failed with status: ${status}`)
                return data
            }
            
            // Continue polling
            if (attempts < maxAttempts) {
                attempts++
                await sleep(pollInterval)
            }

        } catch (error) {
            return error
        }
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}


app.listen(PORT, () => {
    console.log(`Backend server started @ port ${PORT}`);
})