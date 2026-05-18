import { reducerCases } from "./constants";

export const initialState= {
    userInfo: undefined,
    newUser: false,
    contactsPage: false,
    currentChatUser: undefined,
    messages: [],
    messagesLoading: false,
    messagesSearch:false,
    contactSearch:"",
    contactFilter:"all",
    language:"pt-BR",
};

const reducer = (state,action) => {
    switch (action.type) {
        case reducerCases.SET_USER_INFO:{
            return {
                ...state,
                userInfo:action.userInfo,
            }
        };
        case reducerCases.SET_NEW_USER:
            return {
                ...state,
                newUser:action.newUser,
            };
        case reducerCases.SET_ALL_CONTACTS_PAGE:
            return {
                ...state,
                contactsPage:!state.contactsPage,
            };
        case reducerCases.CHANGE_CURRENT_CHAT_USER:
            return {
                ...state,
                currentChatUser:action.user,
            }
        case reducerCases.SET_MESSAGES:
            return{
                ...state,
                messages: action.messages,
                messagesLoading: false,
            }
        case reducerCases.SET_MESSAGES_LOADING:
            return{
                ...state,
                messagesLoading: action.messagesLoading,
            }
        case reducerCases.ADD_MESSAGE:
            if (state.messages.some((message) => message.id === action.newMessage.id)) {
                return state;
            }
            return {
                ...state,
                messages:[...state.messages, action.newMessage],
            }
        case reducerCases.SET_MESSAGE_SEARCH:
            return {
                ...state,
                messagesSearch:!state.messagesSearch,
            }
        case reducerCases.SET_CONTACT_SEARCH:
            return {
                ...state,
                contactSearch:action.contactSearch,
            }
        case reducerCases.SET_CONTACT_FILTER:
            return {
                ...state,
                contactFilter:action.contactFilter,
            }
        case reducerCases.SET_LANGUAGE:
            return {
                ...state,
                language:action.language,
            }
        default:
            return state;
    }
}

export default reducer;
