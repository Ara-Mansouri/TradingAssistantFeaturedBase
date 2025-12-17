import {ChatMockService} from "./ChatMockService"
import {ChatService} from "./ChatService"
import {IchatTransport} from "../core/IChatTransport"

const MockUsage = true;

export function chatTransport() : IchatTransport
{
    
    return MockUsage ? new ChatMockService : new ChatService ;  
}