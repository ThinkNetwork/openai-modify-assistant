window.function = async function(api_key, assistant_id, name, description, instructions, model, tools, tool_resources, temperature, top_p, metadata, response_format) {
    // Validate required fields
    if (!api_key.value) return "Error: OpenAI API Key is required.";
    if (!assistant_id.value) return "Error: Assistant ID is required.";
    if (!model.value) return "Error: Model is required.";
    if (!instructions.value) return "Error: Instructions are required.";

    // Construct tools array
    const toolsValue = tools.value ? tools.value.split(",").map(t => ({ type: t.trim() })) : [];

    // Construct tool_resources if provided
    const toolResourcesValue = tool_resources.value ? JSON.parse(tool_resources.value) : {};

    // Construct metadata if provided
    const metadataValue = metadata.value ? JSON.parse(metadata.value) : {};

    // Construct request payload
    const payload = {
        name: name.value || undefined, // Only include if provided
        description: description.value || null,
        instructions: instructions.value,
        model: model.value,
        tools: toolsValue,
        tool_resources: toolResourcesValue,
        temperature: temperature.value !== undefined ? parseFloat(temperature.value) : 1.0,
        top_p: top_p.value !== undefined ? parseFloat(top_p.value) : 1.0,
        metadata: metadataValue,
        response_format: response_format.value || "auto"
    };

    // Remove undefined values from payload
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    // API endpoint URL
    const apiUrl = `https://api.openai.com/v1/assistants/${assistant_id.value}`;

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return the response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
