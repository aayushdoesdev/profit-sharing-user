
// for date format 
// 2025-01-28T15:30:22.502759Z

const formatTime = (time) => {
    let date = time.split("T")[1].split(".")[0] || ''
    if(date.includes("Z")){
        return date.replace("Z","")
    } else return date
}

const formatDate = (time) => {
    let date = time.split("T")[0] || ''
    return date
}

const formatDateTime = (time) => {
    let date = time.replace("T", "  ").split(".")[0] || ''
    if(date.includes("Z")){
        return date.replace("Z","")
    } else return date
}

export { formatTime, formatDate, formatDateTime  };
