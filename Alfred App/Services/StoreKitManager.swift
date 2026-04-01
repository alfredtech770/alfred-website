//
//  StoreKitManager.swift
//  Alfred App
//
//  StoreKit / membership state manager.
//

import Foundation
import Combine

class StoreKitManager: ObservableObject {
    static let shared = StoreKitManager()

    @Published var isMember: Bool = false

    private init() {}
}
