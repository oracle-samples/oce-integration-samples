# About the Oracle Content Management Chatbot Sample

This sample demonstrates how to implement an Oracle Digital Assistant (ODA) chatbot which uses Oracle Content Management (OCM) as a headless CMS. It also demonstrates how to integrate an ODA chatbot with a website built using OCM site builder.

This repository holds the sample source code for Oracle Digital Assistant chatbot samples powered by Oracle Content Management.

- [Headless ODA Chatbot Sample](./headless-chatbot-sample/README.md) - It is for developers who want to implement a headless chatbot which uses content from an OCM repository.
- [Site Integration Chatbot Sample](./site-integration-chatbot-sample/README.md) - It is for developers who want to implement and integrate the chatbot with the Sales Enablement Site using OCM site builder.

## Structure

```text
.
├── headless-chatbot-sample
│   ├── ODAChatbot
│   ├── sales-enablement-custom-component
│   └── WebApp
│
└── site-integration-chatbot-sample
    ├── oda-custom-component
    ├── SalesEnablementChatbotIntegration
    └── SE2-ODA-Chatbot
```

| Directory Name | Description |
|--|--|
| `headless-chatbot-sample` | Directory containing source code for headless chatbot sample |
| `ODAChatbot` | ODA skill used for headless chatbot |
| `sales-enablement-custom-component` | ODA custom component used in ODA skill to fetch content from OCM |
| `WebApp` | A simple web application used for hosting the headless chatbot |
| `site-integration-chatbot-sample` | Directory containing source code for site integration chatbot sample |
| `oda-custom-component` | ODA custom component used in ODA skill to fetch content from OCM |
| `SalesEnablementChatbotIntegration` | ODA skill used for site integration chatbot sample |
| `SE2-ODA-Chatbot` | OCM custom component used to add an ODA chatbot on a website built using OCM site builder |

## Contributing

These projects welcome contributions from the community. Before submitting a pull
request, please [review our contribution guide](./CONTRIBUTING.md).

## Security

Please consult the [security guide](./SECURITY.md) for our responsible security
vulnerability disclosure process.

## License

Copyright (c) 2021, 2022, Oracle and/or its affiliates.

Released under the Universal Permissive License v1.0 as shown at
<https://oss.oracle.com/licenses/upl/>.
