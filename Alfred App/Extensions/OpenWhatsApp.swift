//
//  OpenWhatsApp.swift
//  Alfred App
//
//  Utility to open WhatsApp with a pre-filled message.
//

import Foundation
#if canImport(UIKit)
import UIKit
#endif

/// Opens WhatsApp with a pre-filled message to the Alfred concierge number.
func openWhatsApp(message: String = "") {
    #if canImport(UIKit)
    let phone = "33600000000" // Alfred concierge WhatsApp number
    let encoded = message.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
    if let url = URL(string: "https://wa.me/\(phone)?text=\(encoded)") {
        UIApplication.shared.open(url)
    }
    #endif
}
